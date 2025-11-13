import * as me from "melonjs";

class WeaponHud extends me.Renderable {
    constructor(player) {
        super(
            me.game.viewport.width / 2 - 80,
            me.game.viewport.height - 50,
            160, 40
        );
        this.player = player;
        this.alwaysUpdate = true;

        this.textSettings = {
            font: "16px Arial",
            fillStyle: "#FFF",
            textAlign: "left"
        };

        // Crie um Text por slot
        this.texts = [];
        for (let i = 0; i < 3; i++) {
            let text = new me.Text(0, 0, this.textSettings);
            text.setText("");
            this.texts.push(text);
        }
        // Controle para não recriar desnecessariamente
        this._lastLabels = ["", "", ""];
    }

    draw(renderer) {
        for (let i = 0; i < this.player.weapons.length; i++) {
            let x = this.pos.x + i * 48;
            let y = this.pos.y;
            renderer.setColor("#222");
            renderer.fillRect(x, y, 40, 40);

            if (this.player.currentWeaponSlot === i) {
                renderer.setColor("#FFD700");
                renderer.strokeRect(x, y, 40, 40);
            }

            let label = this.player.weapons[i] ? this.player.weapons[i].currentType : "vazio";

            if (this._lastLabels[i] !== label) {
                this.texts[i].setText(label);
                this._lastLabels[i] = label;
            }
            this.texts[i].draw(renderer, x + 5, y + 28);
        }
    }
}
export default WeaponHud;
