import * as me from "melonjs";
import PlayerEntity from "./player.js";
import CONSTANTS, { WEAPON_DROP_RARITIES } from "../constants.js";
import { GameData } from "../gameData.js";
import { recalculateWeaponLevelsFromXP } from "./utils/xpUtils.js";
import WeaponDropEntity from "./weaponDropEntity.js";

function tryDropWeapon(posX, posY) {
    if (Math.random() < 0.10) { // 10% chance de drop
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

class EnemyEntity extends me.Sprite {
    attackCooldown = 1000;
    lastAttackTime = 0;

    constructor(x, y) {
        super(x, y, {
            image: "zombie-axe-idle",
            framewidth: 13,
            frameheight: 18,
        });

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

        this.addAnimation("idle", [0, 1, 2, 3], 350);
        this.setCurrentAnimation("idle");
        this.scale(CONSTANTS.SPRITE.SCALE_UP);
        this.speed = 80;
        this.isDying = false;
        this.health = CONSTANTS.ENEMY.BASE_HEALTH;
    }

    takeDamage(amount = 1) {
        if (this.isDying) return;
        this.health -= amount;
        if (this.health <= 0) {
            this.startDeath();
        }
    }

    startDeath() {
        if (this.isDying) return;
        this.isDying = true;
        if (this.body.setCollisionMask) this.body.setCollisionMask(0);

        // >>> GANHO DE XP AO MATAR ZUMBI <<<
        GameData.xp += CONSTANTS.XP.PER_ZOMBIE;
        console.log("XP atual:", GameData.xp);

        // Atualiza nível das armas (só pistola, pelo xpUtils.js)
        recalculateWeaponLevelsFromXP();

        // Drop de arma
        tryDropWeapon(this.pos.x, this.pos.y);

        // Efeito visual de morte
        const parent = this.ancestor || me.game.world;
        const deathSprite = new me.Sprite(this.pos.x, this.pos.y, {
            image: me.loader.getImage("zombie-axe-death"),
            framewidth: 27,
            frameheight: 18,
        });
        deathSprite.addAnimation("death", [0, 1, 2, 3, 4, 5], 100);
        deathSprite.setCurrentAnimation("death", () => {
            parent.removeChild(deathSprite);
        });
        deathSprite.scale(CONSTANTS.SPRITE.SCALE_UP);
        parent.addChild(deathSprite, typeof this.z === "number" ? this.z : 2);

        if (parent) parent.removeChild(this);
    }

    onCollision(response, other) {
        if (other.body.collisionType === me.collision.types.PROJECTILE_OBJECT) {
            const dmg = typeof other.damage === "number" ? other.damage : 1;
            this.takeDamage(dmg);
            me.game.world.removeChild(other);
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
}

export default EnemyEntity;
