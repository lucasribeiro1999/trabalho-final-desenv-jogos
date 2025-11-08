import * as me from 'melonjs';

import CONSTANTS from "../constants"

class FireProjectile extends me.Sprite {
    static RATE_MS = CONSTANTS.FIRE.RATE_MS;

    /**
     * @param {number} x
     * @param {number} y
     * @param {"up"|"down"|"left"|"right"} direction
     */
    constructor(x, y, direction = "up") {
        const imageName = `fire-${direction}`;

        const framewidth = (direction === 'up' || direction === 'down') ? 7 : 10;
        const frameheight = (direction === 'up' || direction === 'down') ? 10 : 7;

        super(x, y, {
            image: imageName,
            framewidth: framewidth,
            frameheight: frameheight,
        });

        this.direction = direction;
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

    onResetEvent(x, y, direction) {
        if (typeof x === 'number' && typeof y === 'number') this.pos.set(x, y);
        if (direction) this.direction = direction;
        this.holdDuration = 0;
        this.finishStarted = false;
        this.hasHit = false;
        this.setCurrentAnimation("hold");
        this.setAnimationFrame(0);
    }

    update(dt) {
        if (!this.finishStarted && !this.hasHit) {
            if (this.isCurrentAnimation("hold")) {
                this.setAnimationFrame(0);
            }
            this.holdDuration += dt;
            if (this.holdDuration >= this.holdMaxDuration) {
                this.finishStarted = true;
                this.setCurrentAnimation("finish", () => {
                    me.game.world.removeChild(this);
                });
            }
        }

        const step = (this.speed * dt) / 1000;
        if (this.direction === 'up') this.pos.y -= step;
        if (this.direction === 'down') this.pos.y += step;
        if (this.direction === 'left') this.pos.x -= step;
        if (this.direction === 'right') this.pos.x += step;

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

    onCollision(response, other) {
        if (other.body && other.body.collisionType === me.collision.types.ENEMY_OBJECT) {
            if (this.hasHit) return false;
            this.hasHit = true;
            if (this.body.setCollisionMask) this.body.setCollisionMask(0);
            if (typeof other.startDeath === 'function') {
                other.startDeath();
            }
            me.game.world.removeChild(this);
            return false;
        }
    }
}

export default FireProjectile;


