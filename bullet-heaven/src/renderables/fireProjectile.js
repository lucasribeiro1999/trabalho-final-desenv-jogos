import * as me from 'melonjs';
import CONSTANTS from "../constants";

class FireProjectile extends me.Sprite {
    static RATE_MS = CONSTANTS.FIRE.RATE_MS;

    /**
     * @param {number} x
     * @param {number} y
     * @param {"up"|"down"|"left"|"right"} direction
     * @param {number} [spreadAngle=0] (opcional para shotgun)
     */
    constructor(x, y, direction = "up", spreadAngle = 0) {
        const imageName = `fire-${direction}`;
        const framewidth = (direction === 'up' || direction === 'down') ? 7 : 10;
        const frameheight = (direction === 'up' || direction === 'down') ? 10 : 7;
        super(x, y, { image: imageName, framewidth, frameheight });

        this.direction = direction;
        this.spreadAngle = spreadAngle || 0;
        this.speed = 300;
        this.scale(3);

        this.body = new me.Body(this);
        const scaledWidth = this.width;
        const scaledHeight = this.height;
        this.body.addShape(new me.Rect(0, 0, scaledWidth, scaledHeight));
        this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;
        this.body.ignoreGravity = true;
        if (this.body.setMaxVelocity) this.body.setMaxVelocity(400, 400);
        if (this.body.setCollisionMask) this.body.setCollisionMask(me.collision.types.ENEMY_OBJECT);
        if (this.body.setSensor) this.body.setSensor(true);

        this.addAnimation("hold", [0], 10000);
        this.addAnimation("finish", [1, 2], 100);
        this.setCurrentAnimation("hold");
        this.setAnimationFrame(0);

        this.holdDuration = 0;
        this.holdMaxDuration = 500;
        this.finishStarted = false;

        this.alwaysUpdate = true;
        this.hasHit = false;
    }

    update(dt) {
        if (!this.finishStarted && !this.hasHit) {
            if (this.isCurrentAnimation("hold")) this.setAnimationFrame(0);
            this.holdDuration += dt;
            if (this.holdDuration >= this.holdMaxDuration) {
                this.finishStarted = true;
                this.setCurrentAnimation("finish", () => {
                    me.game.world.removeChild(this);
                });
            }
        }

        const step = (this.speed * dt) / 1000;
        let dx = 0, dy = 0;
        switch (this.direction) {
            case "up": dy = -1; break;
            case "down": dy = 1; break;
            case "left": dx = -1; break;
            case "right": dx = 1; break;
        }
        // Calcula spread (shotgun)
        if (this.spreadAngle !== 0) {
            const angle = Math.atan2(dy, dx) + this.spreadAngle;
            dx = Math.cos(angle);
            dy = Math.sin(angle);
        }
        this.pos.x += dx * step;
        this.pos.y += dy * step;

        if (
            this.pos.x + this.width < 0 ||
            this.pos.x > me.game.viewport.width ||
            this.pos.y + this.height < 0 ||
            this.pos.y > me.game.viewport.height
        ) {
            me.game.world.removeChild(this);
        }
        return super.update(dt);
    }

    // ... onCollision igual ...
}
export default FireProjectile;
