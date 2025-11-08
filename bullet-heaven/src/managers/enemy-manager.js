import * as me from 'melonjs';

import EnemyEntity from './../renderables/enemy.js';

class EnemyManager extends me.Container {
    static COLS = 9;
    static ROWS = 4;

    constructor() {
        super(0, 0, me.game.viewport.width, me.game.viewport.height);

        this.enableChildBoundsUpdate = true;

        this.onChildChange = () => {
            if (this.children.length === 0) {
                me.state.current().reset();
            }
        }
    }

    createEnemies() {
        const initialCount = 10;
        for (let i = 0; i < initialCount; i++) {
            const x = Math.random() * (me.game.viewport.width - 32) + 16;
            const y = Math.random() * (me.game.viewport.height - 32) + 16;
            const enemy = new EnemyEntity(x, y);
            this.addChild(enemy);
        }

        this.createdEnemies = true;
    }

    onActivateEvent() {
        this.timer = me.timer.setInterval(() => {
            const x = Math.random() * (me.game.viewport.width - 32) + 16;
            const y = Math.random() * (me.game.viewport.height - 32) + 16;
            const enemy = new EnemyEntity(x, y);
            this.addChild(enemy);
        }, 4000);
    }

    onDeactivateEvent() {
        me.timer.clearInterval(this.timer);
    }
}

export default EnemyManager;