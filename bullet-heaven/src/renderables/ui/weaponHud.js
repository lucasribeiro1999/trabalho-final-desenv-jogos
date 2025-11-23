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
        const thisWeaponLevel = GameData.weaponLevels[this.weaponType]

        if (thisWeaponLevel === 0) return;

        const sprite = new me.UISpriteElement(x, y, {
            image: this.weaponType
        });
        sprite.scale(3)
        this.parent.addChild(sprite, 100);

        this.xpText = new me.Text(x + 16, y + 1, {
            font: "Micro 5",
            size: 25,
            fillStyle: CONSTANTS.COLORS.WHITE,
            strokeStyle: "#000000",
            lineWidth: 0,
            textAlign: "left",
            textBaseline: "top",
        });
        this.xpText.setText(thisWeaponLevel)
        this.parent.addChild(this.xpText, 101);
    }

    update(dt) {
        const currentLevel = GameData.weaponLevels[this.weaponType];

        if (currentLevel > 0 && !this.xpText) {
            this.drawWeapon(this.pos.x, this.pos.y);
        }

        if (this.xpText) {
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

            if (weaponLevel === 1) strokeColor = CONSTANTS.COLORS.GREEN;
            else if (weaponLevel === 2) strokeColor = CONSTANTS.COLORS.BLUE;
            else if (weaponLevel === 3) strokeColor = CONSTANTS.COLORS.PURPLE;
            else if (weaponLevel === 4) strokeColor = CONSTANTS.COLORS.ORANGE;
            else if (weaponLevel >= 5) strokeColor = CONSTANTS.COLORS.YELLOW;

            renderer.setColor(strokeColor);
            renderer.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
        }
    }
}
export default WeaponHud;
