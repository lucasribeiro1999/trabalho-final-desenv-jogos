import * as me from "melonjs";

import CONSTANTS from "../../constants.js";
import { GameData } from "../../gameData.js";

class XPHUD extends me.Container {
    constructor() {
        super(0, 0, 200, 48);

        this.floating = true;
        this.alwaysUpdate = true;

        this.coinIcon = new me.UISpriteElement(18, 18, {
            image: me.loader.getImage("mana")
        });
        this.addChild(this.coinIcon);

        this.xpText = new me.Text(36, 0, {
            font: "Micro 5",
            size: 38,
            fillStyle: CONSTANTS.COLORS.WHITE,
            strokeStyle: CONSTANTS.COLORS.BLACK,
            lineWidth: 0,
            textAlign: "left",
            textBaseline: "top",
        });
        this.addChild(this.xpText);

        this.floating = true;
        this.alwaysUpdate = true;

        this.lastText = "";
    }

    formatText() {
        const wl = GameData.weaponLevels || {};
        const p = wl.pistol ?? 1;
        const r = wl.rifle ?? 1;
        const s = wl.shotgun ?? 1;
        return `XP: ${GameData.xp} | P:${p} R:${r} S:${s}`;
    }

    update(dt) {
        super.update(dt)

        if (GameData.xp !== this.lastXP) {
            this.lastXP = GameData.xp;
            this.xpText.setText(String(this.lastXP));
            return true;
        }
        return false;
    }

}

export default XPHUD;
