import * as me from 'melonjs';

import { HealtPoint } from '../renderables/ui/healthPoint';

import CONSTANTS from '../constants.js';

export class HealthSystem extends me.Container {
    constructor() {
        super(me.game.viewport.width - 320, me.game.viewport.height - 64, 320, 64);

        this.isPersistent = true;
        this.floating = true;

        this.hearts = [];

        let heartCount = CONSTANTS.PLAYER.MAX_HEALTH;
        let heartSpacing = 64;
        let heartWidth = 32;

        let rowWidth = heartCount * heartWidth + (heartCount - 1) * (heartSpacing - heartWidth);

        let startX = (this.width - rowWidth) / 2;

        for (let i = 0; i < heartCount; i++) {
            let heart = new HealtPoint(startX + i * heartSpacing, (this.height - heartWidth) / 2);
            this.addChild(heart);
            this.hearts.push(heart);
        }
    }

    updateHealth(currentHealth) {
        let missingHealth = CONSTANTS.PLAYER.MAX_HEALTH - currentHealth

        for (let i = 0; i < this.hearts.length; i++) {
            if (missingHealth > 0) {
                this.hearts[i].takeDamage();
                missingHealth--;
            } else {
                this.hearts[i].healDamage();
            }
        }
    }
}
