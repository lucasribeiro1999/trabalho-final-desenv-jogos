import * as me from 'melonjs';

import { HealtPoint } from '../renderables/ui/healthPoint';

import CONSTANTS from '../constants.js';
import { GameData } from '../gameData.js';

export class HealthSystem extends me.Container {
    constructor() {
        super(me.game.viewport.width - 320, me.game.viewport.height - 64, 320, 64);

        this.isPersistent = true;
        this.floating = true;

        me.event.on(me.event.STATE_CHANGE, () => {
            this.renderHearts()
        })
    }

    get maxHeartCount() {
        const maxHealthUpgrade = GameData.activeUpgrades.get(CONSTANTS.UPGRADES.MORE_MAX_HEALTH)
        const upgradeLevel = maxHealthUpgrade?.level ?? 0

        return CONSTANTS.PLAYER.MAX_HEALTH + upgradeLevel;
    }

    renderHearts() {
        this.hearts?.forEach(heart => this.removeChild(heart))
        this.hearts = []

        const heartSpacing = 64;
        const heartWidth = 32;

        const rowWidth = this.maxHeartCount * heartWidth + (this.maxHeartCount - 1) * (heartSpacing - heartWidth);

        const startX = (this.width - rowWidth) / 2;

        for (let i = 0; i < this.maxHeartCount; i++) {
            const heart = new HealtPoint(startX + i * heartSpacing, (this.height - heartWidth) / 2);
            this.addChild(heart);
            this.hearts.push(heart);
        }
    }

    updateHealth(currentHealth) {
        let missingHealth = this.maxHeartCount - currentHealth

        for (let i = 0; i < this.hearts.length; i++) {
            if (missingHealth > 0) {
                this.hearts[i].takeDamage();
                missingHealth--;
            } else {
                this.hearts[i].healDamage();
            }
        }
    }


    onActivateEvent() {
        this.renderHearts();
    }
}
