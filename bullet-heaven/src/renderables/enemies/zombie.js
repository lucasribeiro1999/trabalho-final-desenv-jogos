import * as me from "melonjs";

import PlayScreen from "../../stages/play.js";

import PlayerEntity from "../player.js";
import WeaponDropEntity from "../weaponDropEntity.js";

import { recalculateWeaponLevelsFromXP } from "../utils/xpUtils.js";

import { GameData } from "../../gameData.js";
import CONSTANTS, { WEAPON_DROP_RARITIES } from "../../constants.js";

function tryDropWeapon(posX, posY) {
    const luckUpgrade = GameData.activeUpgrades.get(CONSTANTS.UPGRADES.LUCK_INCREASE);
    const luckLevel = luckUpgrade?.level ?? 0;
    const dropChance = 0.10 + (luckLevel * 0.05);

    if (Math.random() < dropChance) {
        let roll = Math.random() * 100;
        let acc = 0;
        let r;
        for (const rarity of WEAPON_DROP_RARITIES) {
            acc += rarity.chance;
            if (roll < acc) {
                r = rarity;
                break;
            }
        }

        const weaponTypes = ["pistol", "rifle", "shotgun"];
        const type = weaponTypes[Math.floor(Math.random() * weaponTypes.length)];
        const level = r.minLevel === r.maxLevel
            ? r.maxLevel
            : r.minLevel + Math.floor(Math.random() * (r.maxLevel - r.minLevel + 1));

        me.game.world.addChild(
            new WeaponDropEntity(posX, posY, type, level, r.type),
            5
        );
    }
}
export class Zombie extends me.Sprite {
    constructor(x, y, image, frameWidth, frameHeight, initialHealth = 1, level = 1, baseAttackCooldown = 1000) {
        super(x, y, {
            image,
            framewidth: frameWidth,
            frameheight: frameHeight,
        });

        this.body = new me.Body(this);
        this.body.addShape(new me.Rect(0, 0, this.width, this.height));
        this.body.collisionType = me.collision.types.ENEMY_OBJECT;
        this.body.ignoreGravity = true;

        this.level = level;

        this.baseAttack = 5;
        this.baseSpeed = 80;
        this.isDying = false;

        this.health = CONSTANTS.ENEMY.BASE_HEALTH;

        this.health = initialHealth;
        this.attackDamage = this.calculateAttack();
        this.speed = this.calculateSpeed();

        this.attackCooldown = baseAttackCooldown;
        this.lastAttackTime = 0;

        this.damageCooldown = 1000;
        this.lastTimeAttacked = 0;

        this.isDying = false;

        this.#_setupAnimation()
        this.#_setupZombieBody()
    }

    calculateAttack() {
        return this.baseAttack + (this.level - 1) * 2; // +2 dmg per level
    }

    calculateSpeed() {
        return this.baseSpeed + (this.level - 1) * 5; // +5 speed per level
    }

    startDeath(image, frameWidth, frameHeight, animationSprites) {
        if (this.isDying) return;

        this.isDying = true;

        if (this.body.setCollisionMask) this.body.setCollisionMask(0);

        const xpUpgrade = GameData.activeUpgrades.get(CONSTANTS.UPGRADES.XP_DROP_INCREASE);
        const xpLevel = xpUpgrade?.level ?? 0;
        const xpMultiplier = 1 + (xpLevel * 0.2);

        GameData.xp += CONSTANTS.XP.PER_ZOMBIE * xpMultiplier;

        // Atualiza nível das armas (só pistola, pelo xpUtils.js)
        recalculateWeaponLevelsFromXP();

        // Drop de arma
        tryDropWeapon(this.pos.x, this.pos.y);

        // Efeito visual de morte
        const parent = this.ancestor || me.game.world;
        const deathSprite = new me.Sprite(this.pos.x, this.pos.y, {
            image: image,
            framewidth: frameWidth,
            frameheight: frameHeight,
        });
        deathSprite.addAnimation("death", animationSprites, 100);
        deathSprite.setCurrentAnimation("death", () => {
            parent.removeChild(deathSprite);
        });
        deathSprite.scale(CONSTANTS.SPRITE.SCALE_UP);

        parent?.addChild(deathSprite, typeof this.z === "number" ? this.z : 2);
        parent?.removeChild(this);
    }

    takeDamage(amount = 1) {
        if (this.isDying) return;

        this.health -= amount;
        if (this.health <= 0) {
            this.startDeath();
        }
    }


    onCollision(response, other) {
        if (other.body.collisionType === me.collision.types.PROJECTILE_OBJECT) {
            const now = me.timer.getTime();

            if (now - this.lastTimeAttacked > this.damageCooldown) {
                const dmg = typeof other.damage === "number" ? other.damage : 1;

                this.takeDamage(dmg);

                this.lastTimeAttacked = now;

                me.game.world.removeChild(other);
            }
            return false;
        }

        if (other.body.collisionType === me.collision.types.PLAYER_OBJECT) {
            if (
                typeof this._lastValidX === "number" &&
                typeof this._lastValidY === "number"
            ) {
                this.pos.x = this._lastValidX;
                this.pos.y = this._lastValidY;
                let now = me.timer.getTime();
                if (now - this.lastAttackTime > this.attackCooldown) {
                    other.takeDamage();
                    this.lastAttackTime = now;
                }
            }
            return false;
        }
    }

    update(dt) {
        // PAUSA TOTAL
        if (PlayScreen.isPaused) return false;

        super.update(dt);

        const prevX = this.pos.x;
        const prevY = this.pos.y;
        if (this.isDying) {
            return true;
        }
        const players = me.game.world.getChildByType(PlayerEntity);
        if (players && players.length > 0) {
            const player = players[0];
            const targetX = player.getBounds().x;
            const targetY = player.getBounds().y;
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


    #_setupAnimation() {
        this.addAnimation("idle", [0, 1, 2, 3, 4, 5], 350);
        this.setCurrentAnimation("idle");

        this.scale(CONSTANTS.SPRITE.SCALE_UP);
    }

    #_setupZombieBody() {
        this.body = new me.Body(this);
        this.body.addShape(new me.Rect(0, 0, this.width, this.height));
        this.body.collisionType = me.collision.types.ENEMY_OBJECT;
        this.body.ignoreGravity = true;

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

    }
}