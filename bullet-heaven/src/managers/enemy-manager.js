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

const WAVES = [
    { count: 1, composition: { small: 1.0 }, level: 1 },
    { count: 8, composition: { small: 0.7, axe: 0.3 }, level: 2 },
    { count: 12, composition: { small: 0.5, axe: 0.3, big: 0.2 }, level: 3 },
    { count: 15, composition: { axe: 0.5, big: 0.5 }, level: 4 },
    { count: 20, composition: { axe: 0.3, big: 0.7 }, level: 5 },
];

class EnemyManager extends me.Container {
    constructor() {
        super(0, 0, me.game.viewport.width, me.game.viewport.height);

        this.enableChildBoundsUpdate = true;

        this.onChildChange = () => {
            if (this.children.length === 0) {
                this.startUpgradeSelection()
            }
        }

        me.event.on(me.event.STATE_CHANGE, (newState, oldState) => {
            if (newState === me.state.PLAY) {
                this.onActivateEvent();
            }
        })
    }

    startUpgradeSelection() {
        const player = GameData.player;

        if (player?.pos) {
            GameData.savedPlayerPos = { x: player.pos.x, y: player.pos.y };
        }

        me.state.change(me.state.UPGRADE_SELECTION);
    }

    nextWave() {
        if (GameData.currentWave >= WAVES.length) {
            console.log("All waves cleared!");
            return;
        }

        const wave = WAVES[GameData.currentWave];
        console.log(`Starting wave ${GameData.currentWave + 1}`);

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

    onDeactivateEvent() { }
}

export default EnemyManager;