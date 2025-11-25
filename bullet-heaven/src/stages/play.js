import * as me from 'melonjs';

import EnemyManager from "../managers/enemy-manager.js";
import { HealthSystem } from '../managers/healthSystem.js';

import PlayerEntity from "../renderables/player.js";

import XPHUD from "../renderables/ui/xpHud.js";
import WaveHUD from "../renderables/ui/waveHud.js";
import PausedText from "../renderables/ui/pausedText.js";
import WeaponDropEntity from "../renderables/weaponDropEntity.js";
import WeaponHudContainer from "../renderables/ui/weaponHudContainer.js";

import CONSTANTS from "../constants.js";
import { GameData } from "../gameData.js";

class PlayScreen extends me.Stage {
    static isPaused = false;
    paused = false;
    pauseTextRenderable = null;
    _pauseKeyPressed = false;

    onResetEvent() {
        /**
         * Se for um "novo jogo" (primeira vez ou depois do GAME OVER),
         * resetamos tudo. Se viermos apenas da tela de upgrades, NÃO
         * devemos zerar XP, níveis, upgrades, etc.
         */
        if (GameData.isNewRun) {
            GameData.xp = 0;
            GameData.weaponLevels = {
                pistol: 1,
                rifle: 0,
                shotgun: 0
            };
            GameData.currentWave = 0;
            GameData.activeUpgrades = new Map();
            GameData.currentWeaponSlot = 0;
            GameData.currentHealth = CONSTANTS.PLAYER.MAX_HEALTH;
            GameData.savedPlayerPos = null;
            GameData.droppedWeapons = [];
            GameData.isNewRun = false;
        }

        me.game.world.backgroundColor.parseCSS("#707B64");

        // Use ImageLayer for proper background handling
        const bgLayer = new me.ImageLayer(0, 0, {
            image: "map-01",
            repeat: "repeat"
        });

        // Scale to cover the entire viewport
        const bgImage = me.loader.getImage("map-01");
        if (bgImage && bgImage.width > 0 && bgImage.height > 0) {
            const scaleX = me.game.viewport.width / bgImage.width;
            const scaleY = me.game.viewport.height / bgImage.height;
            const scale = Math.max(scaleX, scaleY);
            const scaledWidth = bgImage.width * scale;
            const scaledHeight = bgImage.height * scale;

            bgLayer.resize(scaledWidth, scaledHeight);

            // Position at top-left to fill screen
            bgLayer.pos.x = -260;
            bgLayer.pos.y = -20;
        }

        me.game.world.addChild(bgLayer, 0);

        // atlas do player
        me.game.playerAtlas = new me.TextureAtlas(
            me.loader.getJSON("player"),
            me.loader.getImage("player")
        );

        // cria player usando os dados atuais do GameData
        const player = new PlayerEntity();
        GameData.player = player;

        // se havia posição salva (vinda da tela de upgrade), reaplica
        if (GameData.savedPlayerPos) {
            player.pos.x = GameData.savedPlayerPos.x;
            player.pos.y = GameData.savedPlayerPos.y;
        }
        me.game.world.addChild(player, 1);

        // Restaura armas dropadas se não for um novo jogo
        if (!GameData.isNewRun && GameData.droppedWeapons && GameData.droppedWeapons.length > 0) {
            GameData.droppedWeapons.forEach(drop => {
                const weaponDrop = new WeaponDropEntity(
                    drop.x,
                    drop.y,
                    drop.type,
                    drop.level,
                    drop.rarity
                );
                me.game.world.addChild(weaponDrop, 10);
            });
            // Limpa após restaurar para evitar duplicação se o reset for chamado novamente sem destroy
            GameData.droppedWeapons = [];
        }

        // HUD das armas — evita duplicar se já existir por algum motivo
        let existingHud = me.game.world.getChildByType(WeaponHudContainer)[0];
        if (!existingHud) {
            this.weaponSlotsHud = new WeaponHudContainer(player);
            me.game.world.addChild(this.weaponSlotsHud, 99);
        } else {
            existingHud.player = player;
            this.weaponSlotsHud = existingHud;
        }

        // inimigos
        this.enemyManager = new EnemyManager();
        me.game.world.addChild(this.enemyManager, 2);

        // HUD de XP / níveis
        this.xpHud = new XPHUD();
        me.game.world.addChild(this.xpHud, 9999);

        // sistema de corações (HUD de vida)
        GameData.healthSystem = new HealthSystem();
        me.game.world.addChild(GameData.healthSystem, 9999);

        // Wave indicator
        this.waveHud = new WaveHUD();
        me.game.world.addChild(this.waveHud, 9999);

        // bindings
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.A, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.D, "right");
        me.input.bindKey(me.input.KEY.UP, "up");
        me.input.bindKey(me.input.KEY.W, "up");
        me.input.bindKey(me.input.KEY.DOWN, "down");
        me.input.bindKey(me.input.KEY.S, "down");
        me.input.bindKey(me.input.KEY.SPACE, "space");

        me.input.bindKey(me.input.KEY.NUM1, "one");
        me.input.bindKey(me.input.KEY.NUM2, "two");
        me.input.bindKey(me.input.KEY.NUM3, "three");
        me.input.bindKey(me.input.KEY.P, "pause");
    }

    update(dt) {
        // Controle de pause/despause
        if (me.input.isKeyPressed("pause") && !this._pauseKeyPressed) {
            this._pauseKeyPressed = true;
            if (!this.paused) {
                this.paused = true;
                PlayScreen.isPaused = true;

                // ⬇️ PAUSA A MÚSICA
                me.audio.pause("gameplay-theme");

                if (!this.pauseTextRenderable) {
                    this.pauseTextRenderable = new PausedText();
                    me.game.world.addChild(this.pauseTextRenderable, 99999);
                }
            } else {
                this.paused = false;
                PlayScreen.isPaused = false;

                // ⬇️ RESUME A MÚSICA
                me.audio.resume("gameplay-theme");

                if (this.pauseTextRenderable) {
                    me.game.world.removeChild(this.pauseTextRenderable);
                    this.pauseTextRenderable = null;
                }
            }
        }
        if (!me.input.isKeyPressed("pause")) {
            this._pauseKeyPressed = false;
        }

        if (this.paused) {
            return true;
        }

        return true;
    }

    onDestroyEvent() {
        me.input.unbindKey(me.input.KEY.LEFT);
        me.input.unbindKey(me.input.KEY.RIGHT);
        me.input.unbindKey(me.input.KEY.A);
        me.input.unbindKey(me.input.KEY.D);
        me.input.unbindKey(me.input.KEY.UP);
        me.input.unbindKey(me.input.KEY.W);
        me.input.unbindKey(me.input.KEY.DOWN);
        me.input.unbindKey(me.input.KEY.S);
        me.input.unbindKey(me.input.KEY.SPACE);
        me.input.unbindKey(me.input.KEY.NUM1);
        me.input.unbindKey(me.input.KEY.NUM2);
        me.input.unbindKey(me.input.KEY.NUM3);
        me.input.unbindKey(me.input.KEY.P);

        if (this.pauseTextRenderable) {
            me.game.world.removeChild(this.pauseTextRenderable);
            this.pauseTextRenderable = null;
        }

        // Salva armas dropadas
        GameData.droppedWeapons = [];
        const drops = me.game.world.getChildByType(WeaponDropEntity);
        drops.forEach(drop => {
            GameData.droppedWeapons.push({
                x: drop.pos.x,
                y: drop.pos.y,
                type: drop.weaponType,
                level: drop.level,
                rarity: drop.rarity
            });
        });
    }

    checkIfLoss(y) {
        if (y >= GameData.player.pos.y) {
            this.reset();
        }
    }
}

export default PlayScreen;