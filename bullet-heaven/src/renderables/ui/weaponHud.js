import * as me from "melonjs";

import CONSTANTS from "../../constants"

const sprites = {
    [CONSTANTS.WEAPONS.RIFLE.NAME]: me.loader.getImage("rifle"),
    [CONSTANTS.WEAPONS.PISTOL.NAME]: me.loader.getImage("pistol"),
    [CONSTANTS.WEAPONS.SHOTGUN.NAME]: me.loader.getImage("shotgun")
}

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
    }

    drawHighlight() {
        this.isHighlighted = true;
    }


    draw(renderer) {
        super.draw(renderer);

        if (this.player.currentWeapon?.currentType === this.weaponType) {
            renderer.setColor("yellow");
            renderer.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
        }
    }
}
export default WeaponHud;
