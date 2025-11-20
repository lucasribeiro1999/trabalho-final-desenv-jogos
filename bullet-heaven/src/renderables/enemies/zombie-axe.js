import * as me from 'melonjs';

import { Zombie } from "./zombie.js";

export class ZombieAxe extends Zombie {
    constructor(x, y) {
        super(x, y, "zombie-axe-idle", 13, 18, 2)
    }

    startDeath() {
        super.startDeath(me.loader.getImage("zombie-axe-death"), 27, 18, [0, 1, 2, 3, 4, 5])
    }
}
