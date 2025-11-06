import * as me from 'melonjs';
import PlayerEntity from './player.js';

class EnemyEntity extends me.Sprite {
    constructor(x, y) {
        super(x, y, {
            image: "zombie-axe-idle",
            framewidth: 13,
            frameheight: 18,
        });

        // give the sprite a physics body so it can collide and stuff
        this.body = new me.Body(this);
        this.body.addShape(new me.Rect(0, 0, this.width, this.height));
        this.body.collisionType = me.collision.types.ENEMY_OBJECT;
        this.body.ignoreGravity = true;
        // make enemy immovable by physics responses; we move it manually
        if (this.body.setStatic) this.body.setStatic(true);
        this.body.vel.set(0, 0);
        this.body.force.set(0, 0);
        if (this.body.setMaxVelocity) this.body.setMaxVelocity(0, 0);
        if (this.body.setCollisionMask) {
            this.body.setCollisionMask(
                me.collision.types.PLAYER_OBJECT |
                me.collision.types.PROJECTILE_OBJECT
            );
        }

        // randomize and set animation
        this.addAnimation("idle", [0, 1, 2, 3], 350);
        this.setCurrentAnimation("idle");

        this.scale(3)
        this.speed = 80;
        this.isDying = false;
    }

    /**
     * @param response
     * @param other
     * @returns {boolean}
     */
    onCollision(response, other) {
        if (other.body.collisionType === me.collision.types.PROJECTILE_OBJECT) {
            if (this.isDying) return false;
            this.isDying = true;
            // swap to death spritesheet and play once, then remove
            this.setImage(me.loader.getImage("zombie-axe-death"), 27, 18);
            this.addAnimation("death", [0, 1, 2, 3, 4, 5], 100);
            this.setCurrentAnimation("death", () => {
                if (this.ancestor) this.ancestor.removeChild(this);
            });
            // disable further collisions while dying
            if (this.body.setCollisionMask) this.body.setCollisionMask(0);
            return false;
        }
        if (other.body.collisionType === me.collision.types.PLAYER_OBJECT) {
            // avoid physics pushback and resolve overlap by reverting enemy position
            if (typeof this._lastValidX === 'number' && typeof this._lastValidY === 'number') {
                this.pos.x = this._lastValidX;
                this.pos.y = this._lastValidY;
            }
            return false;
        }
    }

    update(dt) {
        super.update(dt);

        const prevX = this.pos.x;
        const prevY = this.pos.y;

        if (this.isDying) {
            return true;
        }

        const players = me.game.world.getChildByType(PlayerEntity);
        if (players && players.length > 0) {
            const player = players[0];
            const targetX = player.getBounds().centerX;
            const targetY = player.getBounds().centerY;

            const dx = targetX - this.getBounds().centerX;
            const dy = targetY - this.getBounds().centerY;
            const len = Math.hypot(dx, dy);
            if (len > 0) {
                const ux = dx / len;
                const uy = dy / len;
                const step = (this.speed * dt) / 1000;
                this.pos.x += ux * step;
                this.pos.y += uy * step;
            }
        }

        this._lastValidX = prevX;
        this._lastValidY = prevY;

        return true;
    }
}

export default EnemyEntity;