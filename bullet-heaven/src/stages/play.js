// src/stages/play.js
import * as me from 'melonjs';
import { GameData } from "../gameData.js";
import XPHUD from "../renderables/ui/xpHud.js";
import PlayerEntity from "../renderables/player.js";
import WeaponHudContainer from "../renderables/ui/weaponHudContainer.js";
import EnemyManager from "../managers/enemy-manager.js";
import { HealthSystem } from '../managers/healthSystem.js';
import PausedText from "../renderables/ui/pausedText.js";

class PlayScreen extends me.Stage {
    static isPaused = false;
    paused = false;
    pauseTextRenderable = null;
    _pauseKeyPressed = false;

    onResetEvent() {
        // sempre que começar/der reset na fase, zera o XP e os níveis
        GameData.xp = 0;
        GameData.weaponLevels.pistol = 1;
        GameData.weaponLevels.rifle = 1;
        GameData.weaponLevels.shotgun = 1;

        me.game.world.backgroundColor.parseCSS("#707B64");
        const bgImage = me.loader.getImage("map-01");
        if (bgImage) {
            const bg = new me.Renderable(
                0, 0,
                me.game.viewport.width, me.game.viewport.height
            );
            bg.draw = function (renderer) {
                if (bgImage.width > 0 && bgImage.height > 0) {
                    const scaleX = me.game.viewport.width / bgImage.width;
                    const scaleY = me.game.viewport.height / bgImage.height;
                    const scale = Math.min(scaleX, scaleY);
                    const scaledWidth = bgImage.width * scale;
                    const scaledHeight = bgImage.height * scale;
                    const offsetX = me.game.viewport.width / 2;
                    const offsetY = me.game.viewport.height / 2;
                    renderer.drawImage(
                        bgImage,
                        offsetX, offsetY,
                        scaledWidth, scaledHeight
                    );
                }
            };
            me.game.world.addChild(bg, 0);
        }

        me.game.playerAtlas = new me.TextureAtlas(
            me.loader.getJSON("player"),
            me.loader.getImage("player")
        );

        const player = new PlayerEntity();
        me.game.world.addChild(player, 1);

        GameData.player = player
        if (GameData.savedPlayerPos) {
            GameData.player.pos.x = GameData.savedPlayerPos.x;
            GameData.player.pos.y = GameData.savedPlayerPos.y;
        }

        // HUD das armas: sempre visível sobre o jogo
        this.weaponSlotsHud = new WeaponHudContainer(GameData.player)
        me.game.world.addChild(this.weaponSlotsHud, 99);

        this.enemyManager = new EnemyManager();
        me.game.world.addChild(this.enemyManager, 2);

        // HUD de XP / níveis
        this.xpHud = new XPHUD();
        me.game.world.addChild(this.xpHud, 9999);

        GameData.healthSystem = new HealthSystem();
        me.game.world.addChild(GameData.healthSystem, 9999);

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
                if (!this.pauseTextRenderable) {
                    this.pauseTextRenderable = new PausedText();
                    me.game.world.addChild(this.pauseTextRenderable, 99999);
                }
            } else {
                this.paused = false;
                PlayScreen.isPaused = false;
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

        if (this.player?.currentHealth <= 0) {
            setTimeout(() => {
                me.state.change(me.state.GAMEOVER);
            }, 1000);
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
    }

    checkIfLoss(y) {
        if (y >= GameData.player.pos.y) {
            this.reset();
        }
    }
}

export default PlayScreen;
