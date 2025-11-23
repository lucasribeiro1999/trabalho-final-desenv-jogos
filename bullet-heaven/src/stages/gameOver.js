import * as me from 'melonjs';

import { GameData } from '../gameData.js';
import CONSTANTS from '../constants.js';

class GameOverScreen extends me.Stage {
    onResetEvent() {
        // Limpa todos os objetos do mundo
        me.game.world.children.length = 0;

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

            // Próximo PLAY será um NOVO JOGO
            GameData.isNewRun = true;
            GameData.currentWeaponSlot = 0;
            GameData.currentHealth = CONSTANTS.PLAYER.MAX_HEALTH;
            GameData.xp = 0;
            GameData.weaponLevels = {
                pistol: 1,
                rifle: 1,
                shotgun: 1
            };
            GameData.currentWave = 0;
            GameData.activeUpgrades = new Map();
            GameData.savedPlayerPos = null;

            me.state.change(me.state.PLAY);
        }
        return true;
    }

    onDestroyEvent() {
        me.input.unbindKey(me.input.KEY.ENTER);
    }
}

export default GameOverScreen;
