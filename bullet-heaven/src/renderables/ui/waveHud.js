import * as me from "melonjs";

import CONSTANTS from "../../constants.js";
import { GameData } from "../../gameData.js";

class WaveHUD extends me.Container {
    constructor() {
        super(me.game.viewport.width / 2, 20, 200, 48);

        this.floating = true;
        this.alwaysUpdate = true;

        this.waveText = new me.Text(0, 0, {
            font: "Micro 5",
            size: 48,
            fillStyle: CONSTANTS.COLORS.WHITE,
            textAlign: "center",
            textBaseline: "top",
        });
        this.addChild(this.waveText);

        this.lastWave = -1;
    }

    update(dt) {
        super.update(dt);

        if (GameData.currentWave !== this.lastWave) {
            this.lastWave = GameData.currentWave;
            this.waveText.setText(`Horda: ${GameData.currentWave}`);
            return true;
        }
        return false;
    }
}

export default WaveHUD;
