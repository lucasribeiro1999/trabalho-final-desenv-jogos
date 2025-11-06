import * as me from 'melonjs';

import CONSTANTS from '../constants.js';

class PlayerEntity extends me.Sprite {

    /**
     * constructor
     */
    constructor() {
        let image = me.loader.getImage("player");

        super(
            me.game.viewport.width / 2 - image.width / 2,
            me.game.viewport.height / 2 - image.height / 2,
            {
                image,
                framewidth: 13,
                frameheight: 16,
            }
        );

        this.body = new me.Body(this);
        this.body.addShape(new me.Rect(0, 0, this.width, this.height));
        this.body.collisionType = me.collision.types.PLAYER_OBJECT;
        this.body.ignoreGravity = true;


        this.vely = 450;
        this.velx = 450;
        this.maxX = me.game.viewport.width - this.width;

        this.scale(3)
    }

    /**
     * update the entity
     */
    update(dt) {
        super.update(dt);

        // remember previous position to resolve collisions cleanly
        const prevX = this.pos.x;
        const prevY = this.pos.y;

        if (me.input.isKeyPressed("left")) {
            this.pos.x -= this.velx * dt / 1000;
        }

        if (me.input.isKeyPressed("right")) {
            this.pos.x += this.velx * dt / 1000;
        }

        if (me.input.isKeyPressed("up")) {
            this.pos.y -= this.vely * dt / 1000;
        }

        if (me.input.isKeyPressed("down")) {
            this.pos.y += this.vely * dt / 1000;
        }

        if (me.input.isKeyPressed("shoot")) {
            me.game.world.addChild(me.pool.pull("laser", this.getBounds().centerX - CONSTANTS.LASER.WIDTH / 2, this.getBounds().top));
        }

        this.pos.x = me.Math.clamp(this.pos.x, 32, this.maxX);

        // store last valid position for collision handler
        this._lastValidX = prevX;
        this._lastValidY = prevY;

        return true;
    }

    onCollision(response, other) {
        if (other.body && other.body.collisionType === me.collision.types.ENEMY_OBJECT) {
            // revert to last valid position to block movement through the enemy
            if (typeof this._lastValidX === 'number' && typeof this._lastValidY === 'number') {
                this.pos.x = this._lastValidX;
                this.pos.y = this._lastValidY;
            }
            return false; // prevent default physics response (no push/knockback)
        }
    }
};

export default PlayerEntity;