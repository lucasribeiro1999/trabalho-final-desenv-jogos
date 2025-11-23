import * as me from 'melonjs'

import CONSTANTS from '../../constants';
import { GameData } from '../../gameData';

export class RerollButton extends me.Container {
    constructor(x, y) {
        const w = 300;
        const h = 60;

        super(x - w / 2, y - h / 2, w, h);

        this.textObj = new me.Text(w / 2, h / 2, {
            font: "Micro 5",
            size: 48,
            fillStyle: GameData.xp >= CONSTANTS.XP.REROLL_COST ? CONSTANTS.COLORS.WHITE : "#555555",
            textAlign: "center",
            textBaseline: "middle",
            text: `Resetar (${CONSTANTS.XP.REROLL_COST} XP)`
        });
        this.addChild(this.textObj);
    }

    onClick() {
        if (GameData.upgradeSystem.reroll()) {
            const newColor = GameData.xp >= CONSTANTS.XP.REROLL_COST ? CONSTANTS.COLORS.WHITE : "#555555";
            this.textObj.fillStyle.parseCSS(newColor);

            this.textObj.setText(`Resetar (${CONSTANTS.XP.REROLL_COST} XP)`);

            return true;
        }
        return false;
    }
}