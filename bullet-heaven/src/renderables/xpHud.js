import * as me from "melonjs";
import { GameData } from "../gameData.js";

class XPHUD extends me.Container {
    constructor() {
        super(0, 0, 200, 48);

        this.floating = true;
        this.alwaysUpdate = true;

        this.coinIcon = new me.UISpriteElement(18, 18, {
            image: me.loader.getImage("gold-coin")
        });
        this.addChild(this.coinIcon);

        this.xpText = new me.Text(36, 11, {
            font: "sans-serif",
            size: 22,
            fillStyle: "#ffffff",
            textAlign: "left",
            textBaseline: "top",
        });

        this.floating = true;
        this.alwaysUpdate = true;

        this.lastText = "";
        this.setText(this.formatText());
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

        // só atualiza se o XP mudou
        if (GameData.xp !== this.lastXP) {
            this.lastXP = GameData.xp;
            this.xpText.setText(String(this.lastXP));
            return true; // precisa redesenhar
        }
        return false;

        //  const newText = this.formatText();
        // if (newText !== this.lastText) {
        //     this.lastText = newText;
        //     this.setText(newText);
        //     return true;
        //     this.goldText.setText("0");
        //     this.addChild(this.goldText);

        //     this.lastXP = -1;
        // }
    }

}

export default XPHUD;
