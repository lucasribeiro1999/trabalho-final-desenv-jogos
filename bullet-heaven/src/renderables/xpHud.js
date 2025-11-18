// src/renderables/xpHud.js
import * as me from "melonjs";
import { GameData } from "../gameData.js";

class XPHUD extends me.Text {
    constructor() {
        super(10, 10, {
            font: "Arial",
            size: 24,
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
        const newText = this.formatText();
        if (newText !== this.lastText) {
            this.lastText = newText;
            this.setText(newText);
            return true;
        }
        return false;
    }
}

export default XPHUD;
