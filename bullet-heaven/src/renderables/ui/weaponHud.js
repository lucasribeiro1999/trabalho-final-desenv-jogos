import * as me from "melonjs";

import { GameData } from "../../gameData";
import CONSTANTS from "../../constants.js";

class WeaponHud extends me.UISpriteElement {
    constructor(x, y, player, weaponType, parent, isActive) {
        super(
            x,
            y,
            {
                image: "cell",
                framewidth: 19,
                frameheight: 20
            }
        );

        this.player = player
        this.parent = parent
        this.weaponType = weaponType
        this.isActive = isActive

        this.alwaysUpdate = true;

        this.scale(3)

        if (isActive) this.drawWeapon(x, y)
    }

    drawWeapon(x, y) {
        const sprite = new me.UISpriteElement(x, y, {
            image: this.weaponType
        });
        sprite.scale(3)
        this.parent.addChild(sprite, 100);

        console.log(GameData.weaponLevels);

        const thisWeaponLevel = GameData.weaponLevels[this.weaponType]
        this.xpText = new me.Text(x + 10, y + 6, {
            font: "sans-serif",
            size: 25,
            fillStyle: "#ffffff",
            textAlign: "left",
            textBaseline: "top",
            strokeStyle: "#000"
        });
        this.xpText.setText(thisWeaponLevel)
        this.parent.addChild(this.xpText, 101);
    }

    update(dt) {
        // Update the weapon level text
        if (this.xpText) {
            const currentLevel = GameData.weaponLevels[this.weaponType];
            this.xpText.setText(currentLevel);
        }
        return super.update(dt);
    }

    drawHighlight() {
        this.isHighlighted = true;
    }


    draw(renderer) {
        super.draw(renderer);

        if (this.player.currentWeapon?.currentType === this.weaponType) {
            const weaponLevel = GameData.weaponLevels[this.weaponType];
            let strokeColor = "yellow";

            if (weaponLevel === 1) strokeColor = CONSTANTS.COLORS.BLUE;
            else if (weaponLevel === 2) strokeColor = CONSTANTS.COLORS.PURPLE;
            else if (weaponLevel >= 3) strokeColor = CONSTANTS.COLORS.ORANGE;

            renderer.setColor(strokeColor);
            renderer.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
        }
    }
}
export default WeaponHud;
