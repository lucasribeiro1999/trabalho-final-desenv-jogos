import * as me from 'melonjs';
import CONSTANTS from '../constants.js';
import WeaponEntity from './weapon.js';

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
                -this.width / 2, -this.height / 2, this.width, this.height
            )
        );
        this.body.collisionType = me.collision.types.PLAYER_OBJECT;
        this.body.ignoreGravity = true;

        this.vely = 450;
        this.velx = 450;
        this.margin = 32;
        this.minX = this.margin;
        this.maxX = me.game.viewport.width - this.width - this.margin;
        this.minY = this.margin;
        this.maxY = me.game.viewport.height - this.height - this.margin;

        this.facing = 'up';
        this.isMoving = false;
        this.lastFacing = 'up';

        this.setupAnimations();

        // Três slots de armas
        this.weapons = [
            new WeaponEntity(this, "pistola"),
            new WeaponEntity(this, "fuzil de assalto"),
            new WeaponEntity(this, "shotgun")
        ];
        this.currentWeaponSlot = 0;
        me.game.world.addChild(this.weapons[0], 3);
    }

    switchWeapon(slot) {
    if (
        slot >= 0 &&
        slot < this.weapons.length &&
        slot !== this.currentWeaponSlot
    ) {
        // Remove arma atual, se houver
        if (this.weapons[this.currentWeaponSlot]) {
            me.game.world.removeChild(this.weapons[this.currentWeaponSlot]);
        }
        this.currentWeaponSlot = slot;
        // Adiciona arma nova, se houver
        if (this.weapons[slot]) {
            me.game.world.addChild(this.weapons[slot], 3);
        }
    }
}


    setupAnimations() {
        // Ajuste conforme seus assets JSON e atlas
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
        this.renderable.setCurrentAnimation(`running-${direction}`);
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

        // Troca de arma: teclas 1, 2, 3
        if (me.input.isKeyPressed("one")) this.switchWeapon(0);
        if (me.input.isKeyPressed("two")) this.switchWeapon(1);
        if (me.input.isKeyPressed("three")) this.switchWeapon(2);

        this.pos.x = me.Math.clamp(this.pos.x, this.minX, this.maxX);
        this.pos.y = me.Math.clamp(this.pos.y, this.minY, this.maxY);
        this._lastValidX = prevX;
        this._lastValidY = prevY;

        return true;
    }

    onCollision(response, other) {
        if (!(other?.body)) return false;
        if (other.body.collisionType === me.collision.types.ENEMY_OBJECT) {
            if (typeof this._lastValidX === 'number' && typeof this._lastValidY === 'number') {
                this.pos.x = this._lastValidX;
                this.pos.y = this._lastValidY;
                if (this.body && this.body.vel) {
                    this.body.vel.x = 0;
                    this.body.vel.y = 0;
                }
            }
            return false;
        }
        return false;
    }
}

export default PlayerEntity;
