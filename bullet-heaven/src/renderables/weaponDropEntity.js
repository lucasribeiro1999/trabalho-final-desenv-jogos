import * as me from "melonjs";

import CONSTANTS from "../constants.js";

class WeaponDropEntity extends me.Sprite {
    constructor(x, y, weaponType, level, rarity) {
        super(x, y, {
            image: weaponType,
            framewidth: 16,
            frameheight: 16
        });
        this.weaponType = weaponType;
        this.level = level;
        this.rarity = rarity;

        this.body = new me.Body(this);
        this.body.addShape(new me.Rect(0, 0, this.width, this.height));
        this.body.collisionType = me.collision.types.COLLECTABLE_OBJECT;
        this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT);

        this.scale(2)

        // MANTÉM ITEM PARADO
        if (this.body.setStatic) this.body.setStatic(true);     // Fica imóvel
        this.body.ignoreGravity = true;
        if (this.body.setSensor) this.body.setSensor(true);     // Vira 'sensor': detecta, mas não empurra

        this.alwaysUpdate = true;
        this.lifeTime = 30000;
    }

    draw(renderer) {
        let color = "#ffffff";
        if (this.level === 1) color = CONSTANTS.COLORS.GREEN;
        else if (this.level === 2) color = CONSTANTS.COLORS.BLUE;
        else if (this.level === 3) color = CONSTANTS.COLORS.PURPLE;
        else if (this.level === 4) color = CONSTANTS.COLORS.ORANGE;
        else if (this.level >= 5) color = CONSTANTS.COLORS.YELLOW;

        const ctx = renderer.getContext();
        const centerX = this.pos.x + this.width / 2;
        const centerY = this.pos.y + this.height / 2;
        const radius = 12;

        // Create radial gradient for glow effect
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, color + "40"); // Very subtle center
        gradient.addColorStop(0.4, color + "30"); // Fade
        gradient.addColorStop(1, color + "00"); // Fully transparent

        renderer.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        renderer.restore();

        super.draw(renderer);
    }

    onCollision(response, other) {
        if (typeof other.addWeapon === "function") {
            other.addWeapon(this.weaponType, this.level, this.rarity);

            // Remove do mundo após ser pego
            me.game.world.removeChild(this);
        }
        return false;
    }
}

export default WeaponDropEntity;
