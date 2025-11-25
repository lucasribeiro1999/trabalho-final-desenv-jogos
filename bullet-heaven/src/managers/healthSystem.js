import * as me from 'melonjs';

import { HealtPoint } from '../renderables/ui/healthPoint';

import CONSTANTS from '../constants.js';
import { GameData } from '../gameData.js';

export class HealthSystem extends me.Container {
    constructor() {
        super(me.game.viewport.width - 320, me.game.viewport.height - 64, 320, 64);

        this.floating = true;
    }

    get maxHeartCount() {
        const maxHealthUpgrade = GameData.activeUpgrades.get(CONSTANTS.UPGRADES.MORE_MAX_HEALTH)
        const upgradeLevel = maxHealthUpgrade?.level ?? 0

        return CONSTANTS.PLAYER.MAX_HEALTH + upgradeLevel;
    }

    renderHearts() {
        this.hearts?.forEach(heart => this.removeChild(heart))
        this.hearts = []

        const heartSpacing = 48;
        const heartWidth = 32;
        const padding = 16

        const rightX = this.width - heartWidth - padding;

        for (let i = 0; i < this.maxHeartCount; i++) {
            const x = rightX - i * heartSpacing;
            const y = (this.height - heartWidth) / 2;

            const heart = new HealtPoint(x, y);
            this.addChild(heart);
            this.hearts.push(heart);
        }

        this.updateHealth(GameData.currentHealth ?? CONSTANTS.PLAYER.MAX_HEALTH);
    }

    updateHealth(currentHealth) {
        let missingHealth = this.maxHeartCount - currentHealth

        for (let i = this.hearts.length - 1; i >= 0; i--) {
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
