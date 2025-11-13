// src/renderables/xpHud.js
import * as me from "melonjs";
import { GameData } from "../gameData.js";

class XPHUD extends me.Text {
    constructor() {
        // posição (10,10) e config do texto
        super(10, 10, {
            font: "Arial",
            size: 24,
            fillStyle: "#ffffff",
            textAlign: "left",
            textBaseline: "top",
        });

        // HUD fixo na tela
        this.floating = true;
        this.alwaysUpdate = true;

        this.lastXP = -1;
        this.setText("XP: 0");
    }

    update(dt) {
        // só atualiza se o XP mudou
        if (GameData.xp !== this.lastXP) {
            this.lastXP = GameData.xp;
            this.setText(`XP: ${this.lastXP}`);
            return true; // precisa redesenhar
        }
        return false; // nada mudou
    }
}

export default XPHUD;
