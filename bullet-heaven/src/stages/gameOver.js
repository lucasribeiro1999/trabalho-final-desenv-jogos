import * as me from 'melonjs';

import { GameData } from '../gameData.js';
import CONSTANTS from '../constants.js';

class GameOverScreen extends me.Stage {
    onResetEvent() {
        me.game.world.children.length = 0; // Limpa todos os objetos do mundo

        // Fundo preto
        me.game.world.backgroundColor.parseCSS('#000000');

        // Texto centralizado de Game Over
        const gameOverText = new me.Text(
            me.game.viewport.width / 2,
            me.game.viewport.height / 2,
            {
                font: "Arial",
                size: 48,
                fillStyle: "#FFFFFF",
                textAlign: "center",
                text: "GAME OVER\nPress ENTER to Restart"
            }
        );
        gameOverText.anchorPoint.set(0.5, 0.5);
        me.game.world.addChild(gameOverText);

        // Bind key to restart game
        me.input.bindKey(me.input.KEY.ENTER, "enter");
    }

    update() {
        if (me.input.isKeyPressed("enter")) {
            me.input.unbindKey(me.input.KEY.ENTER);
            GameData.currentWeaponSlot = 0;
            GameData.currentHealth = CONSTANTS.PLAYER.MAX_HEALTH;
            me.state.change(me.state.PLAY);
        }
        return true;
    }

    onDestroyEvent() {
        me.input.unbindKey(me.input.KEY.ENTER);
        // Não limpe manualmente me.game.world.children aqui.
    }
}

export default GameOverScreen;
