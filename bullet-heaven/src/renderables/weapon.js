import * as me from "melonjs";
import FireProjectile from './fireProjectile.js';
import CONSTANTS from '../constants.js';

class WeaponEntity extends me.Renderable {
    constructor(owner, type = "pistola") {
        super(owner.pos.x, owner.pos.y, 20, 20);
        this.owner = owner;
        this.cooldown = 0;
        this.currentType = type;
        if (type === "pistola") {
            this.rate = 350;
        } else if (type === "fuzil de assalto") {
            this.rate = 120;
        } else if (type === "shotgun") {
            this.rate = 700;
        }
        this.alwaysUpdate = true;
    }

    update(dt) {
        this.pos.x = this.owner.pos.x;
        this.pos.y = this.owner.pos.y;
        if (this.cooldown > 0) this.cooldown -= dt;

        if (me.input.isKeyPressed("space") && this.cooldown <= 0) {
            this.shoot();
            this.cooldown = this.rate;
        }
        return super.update(dt);
    }

    shoot() {
        let spawnX = this.owner.pos.x + this.owner.width / 2;
        let spawnY = this.owner.pos.y + this.owner.height / 2;
        let facing = this.owner.facing || 'up';

        if (this.currentType === "shotgun") {
            // Shotgun: três projéteis em cone
            const spreadAngles = [-0.3, 0, 0.3];
            spreadAngles.forEach(angle => {
                me.game.world.addChild(new FireProjectile(spawnX, spawnY, facing, angle), 3);
            });
        } else {
            // Pistola e fuzil: apenas um disparo
            me.game.world.addChild(new FireProjectile(spawnX, spawnY, facing), 3);
        }
    }
}
export default WeaponEntity;
