import * as me from 'melonjs';

import { ZombieAxe } from '../renderables/enemies/zombie-axe.js';
import { ZombieBig } from '../renderables/enemies/zombie-big.js';
import { ZombieSmall } from '../renderables/enemies/zombie-small.js';

import { GameData } from '../gameData.js';

me.pool.register("ZombieAxe", ZombieAxe);
me.pool.register("ZombieSmall", ZombieSmall);
me.pool.register("ZombieBig", ZombieBig);

const ENEMY_VARIANTS = {
    axe: "ZombieAxe",
    small: "ZombieSmall",
    big: "ZombieBig",
};

// Wave progression constants
const WAVE_CONFIG = {
    // Wave thresholds for introducing new variants
    AXE_APPEARS_AT: 3,      // Axe zombies appear at wave 3
    BIG_APPEARS_AT: 6,      // Big zombies appear at wave 6

    // Base counts and growth rates
    BASE_COUNT: 5,          // Starting enemy count
    COUNT_GROWTH: 1.3,      // Exponential growth factor for enemy count

    // Level progression
    BASE_LEVEL: 1,
    LEVEL_INCREASE_EVERY: 3, // Increase enemy level every N waves
};

class EnemyManager extends me.Container {
    constructor() {
        super(0, 0, me.game.viewport.width, me.game.viewport.height);

        this.enableChildBoundsUpdate = true;

        this.onChildChange = () => {
            if (this.children.length === 0) {
                this.startUpgradeSelection()
            }
        }

        this.handler = me.event.on(me.event.STATE_CHANGE, (newState, oldState) => {
            if (newState === me.state.PLAY) {
                this.onActivateEvent();
            }
        })
    }

    startUpgradeSelection() {
        if (GameData.currentHealth <= 0) return;

        const player = GameData.player;

        if (player?.pos) {
            GameData.savedPlayerPos = { x: player.pos.x, y: player.pos.y };
        }

        me.state.change(me.state.UPGRADE_SELECTION);
    }

    /**
     * Generates wave configuration procedurally based on wave number
     */
    generateWave(waveNumber) {
        // Calculate min and max enemy counts (exponential growth)
        const baseMin = Math.floor(WAVE_CONFIG.BASE_COUNT * 0.4); // 40% of base
        const baseMax = WAVE_CONFIG.BASE_COUNT;

        const minCount = Math.floor(baseMin * Math.pow(WAVE_CONFIG.COUNT_GROWTH, waveNumber));
        const maxCount = Math.floor(baseMax * Math.pow(WAVE_CONFIG.COUNT_GROWTH, waveNumber));

        // Weighted random between min and max (favors maximum)
        // Using squared random to bias towards higher values
        const randomFactor = Math.pow(Math.random(), 0.5); // Square root makes it favor max
        const count = Math.floor(minCount + (maxCount - minCount) * randomFactor);

        // Calculate enemy level
        const level = WAVE_CONFIG.BASE_LEVEL + Math.floor(waveNumber / WAVE_CONFIG.LEVEL_INCREASE_EVERY);

        // Build composition based on wave number
        const composition = {};

        if (waveNumber < WAVE_CONFIG.AXE_APPEARS_AT) {
            // Early waves: only small zombies
            composition.small = 1.0;
        } else if (waveNumber < WAVE_CONFIG.BIG_APPEARS_AT) {
            // Mid waves: small and axe zombies
            // Axe zombies increase exponentially after introduction
            const wavesAfterAxe = waveNumber - WAVE_CONFIG.AXE_APPEARS_AT;
            const axeRatio = Math.min(0.6, 0.2 + (wavesAfterAxe * 0.1));
            composition.small = 1.0 - axeRatio;
            composition.axe = axeRatio;
        } else {
            // Late waves: all three variants
            const wavesAfterBig = waveNumber - WAVE_CONFIG.BIG_APPEARS_AT;

            // Big zombies increase exponentially after introduction
            const bigRatio = Math.min(0.5, 0.15 + (wavesAfterBig * 0.08));

            // Axe zombies continue to increase but slower
            const axeRatio = Math.min(0.4, 0.3 + (wavesAfterBig * 0.05));

            // Small zombies decrease as others increase
            const smallRatio = Math.max(0.1, 1.0 - bigRatio - axeRatio);

            composition.small = smallRatio;
            composition.axe = axeRatio;
            composition.big = bigRatio;
        }

        return { count, minCount, maxCount, composition, level };
    }

    nextWave() {
        const wave = this.generateWave(GameData.currentWave);
        console.log(`Starting wave ${GameData.currentWave + 1}:`, wave);

        for (let i = 0; i < wave.count; i++) {
            const x = Math.random() * (me.game.viewport.width - 32) + 16;
            const y = Math.random() * (me.game.viewport.height - 32) + 16;

            const variantKey = this.pickVariant(wave.composition);
            const EnemyClass = ENEMY_VARIANTS[variantKey];

            const enemy = me.pool.pull(EnemyClass, x, y, wave.level);
            this.addChild(enemy);
        }

        GameData.currentWave++;
    }

    pickVariant(composition) {
        const rand = Math.random();
        let cumulative = 0;
        for (const [key, prob] of Object.entries(composition)) {
            cumulative += prob;
            if (rand <= cumulative) return key;
        }
        return Object.keys(composition)[0];
    }

    onActivateEvent() {
        this.nextWave();
    }

    onDeactivateEvent() {
        me.event.off(me.event.STATE_CHANGE, this.handler);
    }
}

export default EnemyManager;