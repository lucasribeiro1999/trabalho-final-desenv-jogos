import * as me from "melonjs";

import { GameData } from "../gameData.js";

import XPHUD from "../renderables/xpHud.js";
import PlayerEntity from "../renderables/player.js";

import EnemyManager from "../managers/enemy-manager.js";
import { HealthSystem } from '../managers/healthSystem.js';


class PlayScreen extends me.Stage {
    onResetEvent() {
        // sempre que começar/der reset na fase, zera o XP
        GameData.xp = 0;

        me.game.world.backgroundColor.parseCSS("#707B64");

        const bgImage = me.loader.getImage("map-01");
        if (bgImage) {
            const bg = new me.Renderable(
                0,
                0,
                me.game.viewport.width,
                me.game.viewport.height
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
                        offsetX,
                        offsetY,
                        scaledWidth,
                        scaledHeight
                    );
                }
            };
            me.game.world.addChild(bg, 0);
        }

        me.game.playerAtlas = new me.TextureAtlas(
            me.loader.getJSON("player"),
            me.loader.getImage("player")
        );

        this.player = new PlayerEntity();
        me.game.world.addChild(this.player, 1);

        this.enemyManager = new EnemyManager();
        this.enemyManager.createEnemies();
        me.game.world.addChild(this.enemyManager, 2);

        // HUD de XP no topo (z-index alto)
        this.xpHud = new XPHUD();
        me.game.world.addChild(this.xpHud, 9999);

        this.healthSystem = new HealthSystem();
        me.game.world.addChild(this.healthSystem, 9999);

        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.A, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.D, "right");
        me.input.bindKey(me.input.KEY.UP, "up");
        me.input.bindKey(me.input.KEY.W, "up");
        me.input.bindKey(me.input.KEY.DOWN, "down");
        me.input.bindKey(me.input.KEY.S, "down");
    }

    onDestroyEvent() {
        me.input.unbindKey(me.input.KEY.LEFT);
        me.input.unbindKey(me.input.KEY.RIGHT);
        me.input.unbindKey(me.input.KEY.A);
        me.input.unbindKey(me.input.KEY.D);

        me.input.unbindKey(me.input.KEY.SPACE);
    }

    checkIfLoss(y) {
        if (y >= this.player.pos.y) {
            this.reset();
        }
    }
}

export default PlayScreen;
