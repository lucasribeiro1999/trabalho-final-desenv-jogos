import * as me from 'melonjs';
import PlayerEntity from "../renderables/player.js";
import EnemyManager from "../managers/enemy-manager.js";
import WeaponHudContainer from "../renderables/weaponHudContainer.js"; // Importação do HUD das armas

class PlayScreen extends me.Stage {
    onResetEvent() {
        me.game.world.backgroundColor.parseCSS("#707B64");
        const bgImage = me.loader.getImage("map-01");
        if (bgImage) {
            const bg = new me.Renderable(0, 0, me.game.viewport.width, me.game.viewport.height);
            bg.draw = function (renderer) {
                if (bgImage.width > 0 && bgImage.height > 0) {
                    const scaleX = me.game.viewport.width / bgImage.width;
                    const scaleY = me.game.viewport.height / bgImage.height;
                    const scale = Math.min(scaleX, scaleY);
                    const scaledWidth = bgImage.width * scale;
                    const scaledHeight = bgImage.height * scale;
                    const offsetX = (me.game.viewport.width) / 2;
                    const offsetY = (me.game.viewport.height) / 2;
                    renderer.drawImage(bgImage, offsetX, offsetY, scaledWidth, scaledHeight);
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

        // HUD das armas: sempre visível sobre o jogo
        me.game.world.addChild(new WeaponHudContainer(this.player), 99);

        this.enemyManager = new EnemyManager();
        this.enemyManager.createEnemies();
        me.game.world.addChild(this.enemyManager, 2);

        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.A, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.D, "right");
        me.input.bindKey(me.input.KEY.UP, "up");
        me.input.bindKey(me.input.KEY.W, "up");
        me.input.bindKey(me.input.KEY.DOWN, "down");
        me.input.bindKey(me.input.KEY.S, "down");
        me.input.bindKey(me.input.KEY.SPACE, "space"); // disparo

        me.input.bindKey(me.input.KEY.ONE, "one"); // slot 1
        me.input.bindKey(me.input.KEY.TWO, "two"); // slot 2
        me.input.bindKey(me.input.KEY.THREE, "three"); // slot 3
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

        me.input.unbindKey(me.input.KEY.ONE);
        me.input.unbindKey(me.input.KEY.TWO);
        me.input.unbindKey(me.input.KEY.THREE);
    }

    checkIfLoss(y) {
        if (y >= this.player.pos.y) {
            this.reset();
        }
    }
}
export default PlayScreen;
