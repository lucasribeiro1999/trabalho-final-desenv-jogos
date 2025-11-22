import * as me from "melonjs";
import FireProjectile from './fireProjectile.js';
import CONSTANTS from '../constants.js';
import { GameData } from "../gameData.js";

class WeaponEntity extends me.Renderable {
    constructor(owner, type = CONSTANTS.WEAPONS.PISTOL.NAME) {
        super(owner.pos.x, owner.pos.y, 20, 20);

        this.owner = owner;
        this.currentType = type;
        this.cooldown = 0;

        this.rate = 1000;
        this.damage = 1;
        this.range = 400;
        this.projectileCount = 1;
        this._lastLevel = 0;

        this.refreshStatsFromLevel();

        this.alwaysUpdate = true;
    }

    getCurrentLevel() {
        const levels = GameData.weaponLevels || {};
        return levels[this.currentType] || 1;
    }

    refreshStatsFromLevel() {
        const level = this.getCurrentLevel();
        this._lastLevel = level;

        const cfg = CONSTANTS.WEAPONS.CONFIG_BY_NAME[this.currentType];
        if (!cfg) return;

        // Multiplicador por nível (15% por nível)
        const mult = 1 + 0.15 * (level - 1);

        // Fire rate melhora (menor tempo entre disparos) até 40% do valor base
        const minRateFactor = 0.4;
        const rateFactor = Math.max(Math.pow(0.9, level - 1), minRateFactor);

        this.rate = cfg.baseRateMs * rateFactor;
        this.damage = cfg.baseDamage * mult;
        this.range = cfg.baseRange * mult;

        // Shotgun ganha mais projéteis com o level
        if (this.currentType === CONSTANTS.WEAPONS.SHOTGUN.NAME) {
            this.projectileCount = cfg.baseProjectiles + Math.floor((level - 1) / 2);
        } else {
            this.projectileCount = cfg.baseProjectiles;
        }

        console.log(
            `[${this.currentType}] level=${level} rate=${this.rate.toFixed(
                0
            )}ms damage=${this.damage.toFixed(2)} range=${this.range.toFixed(
                0
            )} proj=${this.projectileCount}`
        );
    }

    update(dt) {
        if (!this.owner || !this.owner.pos) return false;

        this.pos.x = this.owner.pos.x;
        this.pos.y = this.owner.pos.y;

        const currentLevel = this.getCurrentLevel();
        if (currentLevel !== this._lastLevel) {
            this.refreshStatsFromLevel();
        }

        if (this.cooldown > 0) this.cooldown -= dt;

        if (this.cooldown <= 0) {
            this.shoot();
            this.cooldown = this.rate;
        }
        return super.update(dt);
    }

    shoot() {
        let spawnX = this.owner.pos.x + this.owner.width / 2;
        let spawnY = this.owner.pos.y + this.owner.height / 2;
        let facing = this.owner.facing || 'up';

        if (this.currentType === CONSTANTS.WEAPONS.SHOTGUN.NAME) {
            const total = this.projectileCount;
            const spreadTotalAngle = 0.6;
            const startAngle = -spreadTotalAngle / 2;
            const stepAngle = total > 1 ? spreadTotalAngle / (total - 1) : 0;

            for (let i = 0; i < total; i++) {
                const angle = startAngle + i * stepAngle;
                me.game.world.addChild(
                    new FireProjectile(
                        spawnX,
                        spawnY,
                        facing,
                        angle,
                        this.damage,
                        this.range
                    ),
                    3
                );
            }
        } else {
            me.game.world.addChild(
                new FireProjectile(spawnX, spawnY, facing, 0, this.damage, this.range),
                3
            );
        }
    }
}
export default WeaponEntity;
