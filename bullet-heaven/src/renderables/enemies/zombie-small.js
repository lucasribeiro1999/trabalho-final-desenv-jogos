import { Zombie } from "./zombie.js";

export class ZombieSmall extends Zombie {
    constructor(x, y) {
        super(x, y, "zombie-small-idle", 11, 15, 2)
    }

    startDeath() {
        super.startDeath("zombie-small-death", 16, 14, [0, 1, 2, 3, 4, 5])
    }
}
