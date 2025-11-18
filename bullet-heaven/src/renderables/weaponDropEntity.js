import * as me from "melonjs";

class WeaponDropEntity extends me.Sprite {
    constructor(x, y, weaponType, level, rarity) {
        super(x, y, {
            image: "filled-heart", // Imagem temporária
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

        // MANTÉM ITEM PARADO
        if (this.body.setStatic) this.body.setStatic(true);     // Fica imóvel
        this.body.ignoreGravity = true;
        if (this.body.setSensor) this.body.setSensor(true);     // Vira 'sensor': detecta, mas não empurra

        this.alwaysUpdate = true;
        this.lifeTime = 30000;
    }

    update(dt) {
        this.lifeTime -= dt;
        if (this.lifeTime <= 0) {
            me.game.world.removeChild(this);
            return false;
        }
        return super.update(dt);
    }

    onCollision(response, player) {
        if (typeof player.addWeapon === "function") {
            player.addWeapon(this.weaponType, this.level, this.rarity);
        }
        me.game.world.removeChild(this);
        return false;
    }
}

export default WeaponDropEntity;
