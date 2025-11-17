import { Zombie } from "./zombie.js";

export class ZombieBig extends Zombie {
    constructor(x, y) {
        super(x, y, "zombie-big-idle", 16, 22, 2)
    }

    startDeath() {
        super.startDeath("zombie-big-death", 29, 23, [0, 1, 2, 3, 4, 5, 6])
    }
}
