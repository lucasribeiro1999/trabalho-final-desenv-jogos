import * as me from 'melonjs';

import { Zombie } from "./zombie.js";

export class ZombieBig extends Zombie {
    constructor(x, y) {
        super(x, y, "zombie-big-idle", 16, 22, 3)
    }

    startDeath() {
        super.startDeath(me.loader.getImage("zombie-big-death"), 29, 23, [0, 1, 2, 3, 4, 5, 6])
    }
}
