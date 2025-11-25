import * as me from 'melonjs';

import CONSTANTS from '../constants.js';
import { GameData } from '../gameData.js';

class GameOverScreen extends me.Stage {
    onResetEvent() {
        me.audio.stop("gameplay-theme");

        // Limpa todos os objetos do mundo
        me.game.world.children.length = 0;

        // Fundo preto
        me.game.world.backgroundColor.parseCSS('#000000');

        // Texto principal GAME OVER com fonte Micro 5
        const gameOverText = new me.Text(
            me.game.viewport.width / 2,
            me.game.viewport.height / 2 - 60,
            {
                font: "Micro 5",
                size: 148,
                fillStyle: CONSTANTS.COLORS.RED,
                strokeStyle: "#000000",
                lineWidth: 0,
                textAlign: "center",
                textBaseline: "middle",
                text: "GAME OVER"
            }
        );
        gameOverText.anchorPoint.set(0.5, 0.5);
        me.game.world.addChild(gameOverText);

        // Subtítulo com instrução
        const restartText = new me.Text(
            me.game.viewport.width / 2,
            me.game.viewport.height / 2 + 40,
            {
                font: "Micro 5",
                size: 48,
                fillStyle: CONSTANTS.COLORS.WHITE,
                strokeStyle: "#000000",
                lineWidth: 0,
                textAlign: "center",
                textBaseline: "middle",
                text: "Aperte ENTER para Reiniciar"
            }
        );
        restartText.anchorPoint.set(0.5, 0.5);
        me.game.world.addChild(restartText);

        // Bind key to restart game
        me.input.bindKey(me.input.KEY.ENTER, "enter");
    }

    update() {
        if (me.input.isKeyPressed("enter")) {
            me.input.unbindKey(me.input.KEY.ENTER);
            // Reset do GameData
            GameData.currentWeaponSlot = 0;
            GameData.currentHealth = CONSTANTS.PLAYER.MAX_HEALTH;
            GameData.currentWave = 0;

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
            GameData.activeUpgrades.clear();
            GameData.currentWave = 0;
            GameData.activeUpgrades = new Map();
            GameData.savedPlayerPos = null;

            me.state.change(me.state.PLAY);
        }
        return true;
    }

    onDestroyEvent() {
        me.audio.play("gameplay-theme");
        me.input.unbindKey(me.input.KEY.ENTER);
    }
}

export default GameOverScreen;