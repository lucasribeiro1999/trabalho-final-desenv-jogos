import * as me from 'melonjs';
import WeaponEntity from './weapon.js';
import PlayScreen from '../stages/play.js';
import CONSTANTS from '../constants.js';
import { GameData } from '../gameData.js';
import { updateWeaponLevel } from '../utils/xpUtils.js';

const PlayerState = {
    IDLE: "idle",
    MOVING: "moving",
    COLLIDING: "colliding",
    DYING: "dying"
};

class PlayerEntity extends me.Entity {
    currentState = PlayerState.IDLE;
    static maxHealth = CONSTANTS.PLAYER.MAX_HEALTH;
    currentHealth = GameData.currentHealth ?? CONSTANTS.PLAYER.MAX_HEALTH;

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

        this.baseVelocity = 350;

        this.margin = 32;
        this.minX = this.margin;
        this.maxX = me.game.viewport.width - this.width - this.margin;
        this.minY = this.margin;
        this.maxY = me.game.viewport.height - this.height - this.margin;

        this.facing = 'up';
        this.isMoving = false;
        this.lastFacing = 'up';

        this.setupAnimations();

        // Build weapons array from GameData - only include weapons that are unlocked (level > 0)
        this.weapons = [];
        if (GameData.weaponLevels.pistol > 0) {
            this.weapons.push(CONSTANTS.WEAPONS.PISTOL.NAME);
        }
        if (GameData.weaponLevels.rifle > 0) {
            this.weapons.push(CONSTANTS.WEAPONS.RIFLE.NAME);
        }
        if (GameData.weaponLevels.shotgun > 0) {
            this.weapons.push(CONSTANTS.WEAPONS.SHOTGUN.NAME);
        }

        this.weaponLevels = {
            pistol: GameData.weaponLevels.pistol ?? 1,
            rifle: GameData.weaponLevels.rifle ?? 0,
            shotgun: GameData.weaponLevels.shotgun ?? 0
        };
        this.currentWeaponSlot = GameData.currentWeaponSlot;
        this.currentWeapon = new WeaponEntity(this, this.weapons[this.currentWeaponSlot]);
        me.game.world.addChild(this.currentWeapon, 3);
    }

    get velocity() {
        const velocityUpgrade = GameData.activeUpgrades.get(CONSTANTS.UPGRADES.MOVE_SPEED_INCREASE);
        const upgradeLevel = velocityUpgrade?.level ?? 0;

        return this.baseVelocity + 32 * upgradeLevel;
    }

    switchWeapon(slot) {
        if (
            slot >= 0 &&
            slot < this.weapons.length &&
            this.weapons?.[slot] !== this.currentWeapon?.currentType
        ) {
            if (this.currentWeapon) {
                me.game.world.removeChild(this.currentWeapon);
            }
            if (this.weapons[slot]) {
                this.currentWeapon = new WeaponEntity(this, this.weapons[slot]);
                me.game.world.addChild(this.currentWeapon, 3);
            }
            this.currentWeaponSlot = slot;
            GameData.currentWeaponSlot = slot;
        }
    }

    setupAnimations() {
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
        // PAUSA TOTAL
        if (PlayScreen.isPaused) return false;

        super.update(dt);

        const prevX = this.pos.x;
        const prevY = this.pos.y;
        this.isMoving = false;

        if (this.currentState === PlayerState.DYING) return false;

        this.currentState = PlayerState.IDLE;

        if (me.input.isKeyPressed("left")) {
            this.pos.x -= this.velocity * dt / 1000;
            this.facing = 'left';
            this.currentState = PlayerState.MOVING;
            this.switchToDirection('left');
            this.isMoving = true;
        }
        if (me.input.isKeyPressed("right")) {
            this.pos.x += this.velocity * dt / 1000;
            this.facing = 'right';
            this.currentState = PlayerState.MOVING;
            this.switchToDirection('right');
            this.isMoving = true;
        }
        if (me.input.isKeyPressed("up")) {
            this.pos.y -= this.velocity * dt / 1000;
            this.facing = 'up';
            this.currentState = PlayerState.MOVING;
            this.switchToDirection('up');
            this.isMoving = true;
        }
        if (me.input.isKeyPressed("down")) {
            this.pos.y += this.velocity * dt / 1000;
            this.facing = 'down';
            this.currentState = PlayerState.MOVING;
            this.switchToDirection('down');
            this.isMoving = true;
        }
        if (!this.isMoving) {
            this.switchToIdle();
        }

        // Troca de arma: teclas 1, 2, 3
        if (me.input.isKeyPressed("one")) this.switchWeapon(0);
        if (me.input.isKeyPressed("two")) this.switchWeapon(1);
        if (me.input.isKeyPressed("three")) this.switchWeapon(2);

        if (this.currentState === PlayerState.IDLE) {
            this.switchToIdle();
        }

        // Limites (paredes)
        this.pos.x = me.Math.clamp(this.pos.x, this.minX, this.maxX);
        this.pos.y = me.Math.clamp(this.pos.y, this.minY, this.maxY);
        this._lastValidX = prevX;
        this._lastValidY = prevY;

        // Sincroniza níveis das armas com GameData
        this.weaponLevels.pistol = GameData.weaponLevels.pistol;
        this.weaponLevels.rifle = GameData.weaponLevels.rifle;
        this.weaponLevels.shotgun = GameData.weaponLevels.shotgun;

        // Atualiza a arma equipada se o nível aumentar
        if (this.currentWeapon?.refreshStatsFromLevel) {
            this.currentWeapon.refreshStatsFromLevel();
        }

        return true;
    }

    healDamage() {
        const healthSystem = GameData.healthSystem;
        if (!healthSystem) return;

        const maxHearts = healthSystem.maxHeartCount;

        // já está com a vida máxima
        if (this.currentHealth >= maxHearts) {
            return;
        }

        this.currentHealth += 1;
        GameData.currentHealth = this.currentHealth;

        healthSystem.updateHealth(this.currentHealth);
    }

    takeDamage() {
        if (this.currentState === PlayerState.COLLIDING) {
            this.currentHealth -= 1;

            if (this.currentHealth <= 0) {
                this.currentHealth = 0;
                this.startDeath();
            }

            GameData.currentHealth = this.currentHealth;
            GameData.healthSystem.updateHealth(this.currentHealth);
        }
    }

    startDeath() {
        this.currentState = PlayerState.DYING;
        this.renderable.setCurrentAnimation("death");
        if (this.body.setCollisionMask) this.body.setCollisionMask(0);
        const parent = this.ancestor || me.game.world;
        setTimeout(() => {
            if (parent) {
                parent.removeChild(this);
                me.state.change(me.state.GAMEOVER);
            }
        }, 1000);
    }

    // coleta/desbloqueio de armas via drop
    addWeapon(type, level) {
        // Use centralized weapon level logic
        updateWeaponLevel(type, level);

        // Se for arma nova, garante que está no slot
        if (!this.weapons.includes(type)) {
            this.weapons.push(type);
        }
    }

    onCollision(response, other) {
        if (!(other?.body)) return false;

        if (other.body.collisionType === me.collision.types.ENEMY_OBJECT) {
            if (typeof this._lastValidX === 'number' && typeof this._lastValidY === 'number') {
                this.currentState = PlayerState.COLLIDING;
                this.pos.x = this._lastValidX;
                this.pos.y = this._lastValidY;
                if (this.body && this.body.vel) {
                    this.body.vel.x = 0;
                    this.body.vel.y = 0;
                }
            } else {
                this.currentState = PlayerState.IDLE;
            }
            return false;
        }

        // coleta de arma via drop
        if (other.body.collisionType === me.collision.types.COLLECTABLE_OBJECT) {
            if (typeof other.onCollision === "function") {
                other.onCollision(response, this);
            }
            return false;
        }

        return false;
    }
}

export default PlayerEntity;
