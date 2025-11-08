import * as me from 'melonjs';

import FireProjectile from './fireProjectile.js';

import CONSTANTS from '../constants.js';

class PlayerEntity extends me.Entity {
    constructor() {
        super(
            me.game.viewport.width / 2,
            me.game.viewport.height / 2,
            {
                width: 13 * CONSTANTS.SPRITE.SCALE_UP,
                height: 16 * CONSTANTS.SPRITE.SCALE_UP,
            }
        );

        this.anchorPoint.set(0.5, 0.5);

        this.body = new me.Body(this);
        this.body.addShape(
            new me.Rect(
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            )
        );
        this.body.collisionType = me.collision.types.PLAYER_OBJECT;
        this.body.ignoreGravity = true;

        this.vely = 450;
        this.velx = 450;
        this.maxX = me.game.viewport.width - this.width;

        this.facing = 'up';
        this.lastShotAt = me.timer.getTime() - CONSTANTS.FIRE.RATE_MS;
        this.isMoving = false;
        this.lastFacing = 'up';

        this.setupAnimations();
    }

    setupAnimations() {
        // this.body.setStatic();

        const animations = me.loader.getJSON("player").animations;

        const idleFrames = animations["idle/idle"];
        const deathFrames = animations["death/death"];
        const runningDownFrames = animations["running/down/down"];
        const runningUpFrames = animations["running/up/up"];
        const runningLeftFrames = animations["running/left/left"];
        const runningRigthFrames = animations["running/right/right"];

        this.renderable = me.game.playerAtlas.createAnimationFromName([
            ...idleFrames,
            ...deathFrames,
            ...runningDownFrames,
            ...runningLeftFrames,
            ...runningRigthFrames,
            ...runningUpFrames
        ]);

        this.renderable.scale(CONSTANTS.SPRITE.SCALE_UP, CONSTANTS.SPRITE.SCALE_UP);

        this.renderable.addAnimation("idle", idleFrames, 125);
        this.renderable.addAnimation("death", deathFrames, 125);
        this.renderable.addAnimation("running-down", runningDownFrames, 125);
        this.renderable.addAnimation("running-up", runningUpFrames, 125);
        this.renderable.addAnimation("running-left", runningLeftFrames, 125);
        this.renderable.addAnimation("running-right", runningRigthFrames, 125);

        this.renderable.setCurrentAnimation("idle");
    }

    switchToDirection(direction) {
        if (this.lastFacing === direction) return;

        this.lastFacing = direction;

        this.renderable.setCurrentAnimation(`running-${direction}`)
    }

    switchToIdle() {
        this.renderable.setCurrentAnimation("idle");
    }

    update(dt) {
        super.update(dt);

        const prevX = this.pos.x;
        const prevY = this.pos.y;

        this.isMoving = false;

        if (me.input.isKeyPressed("left")) {
            this.pos.x -= this.velx * dt / 1000;
            this.facing = 'left';
            this.isMoving = true;
            this.switchToDirection('left');
        }

        if (me.input.isKeyPressed("right")) {
            this.pos.x += this.velx * dt / 1000;
            this.facing = 'right';
            this.isMoving = true;
            this.switchToDirection('right');
        }

        if (me.input.isKeyPressed("up")) {
            this.pos.y -= this.vely * dt / 1000;
            this.facing = 'up';
            this.isMoving = true;
            this.switchToDirection('up');
        }

        if (me.input.isKeyPressed("down")) {
            this.pos.y += this.vely * dt / 1000;
            this.facing = 'down';
            this.isMoving = true;
            this.switchToDirection('down');
        }

        if (!this.isMoving) {
            this.switchToIdle();
        }

        {
            const now = me.timer.getTime();
            const rate = (typeof FireProjectile.RATE_MS === 'number') ? FireProjectile.RATE_MS : 2000;
            if (now - this.lastShotAt >= rate) {
                const centerX = this.getBounds().x + this.width / 2;
                const centerY = this.getBounds().y + this.height / 2;

                let spawnX = centerX;
                let spawnY = centerY;

                const offset = 8;
                if (this.facing === 'up') spawnY = this.getBounds().top - offset;
                if (this.facing === 'down') spawnY = this.getBounds().top + this.height + offset;
                if (this.facing === 'left') spawnX = this.getBounds().left - offset;
                if (this.facing === 'right') spawnX = this.getBounds().left + this.width + offset;

                me.game.world.addChild(new FireProjectile(spawnX, spawnY, this.facing), 3);
                this.lastShotAt = now;
            }
        }

        this.pos.x = me.Math.clamp(this.pos.x, 32, this.maxX);

        this._lastValidX = prevX;
        this._lastValidY = prevY;

        return true;
    }

    onCollision(response, other) {
        if (other.body && other.body.collisionType === me.collision.types.ENEMY_OBJECT) {
            if (typeof this._lastValidX === 'number' && typeof this._lastValidY === 'number') {
                this.pos.x = this._lastValidX;
                this.pos.y = this._lastValidY;
            }
            return false;
        }
    }
};

export default PlayerEntity;