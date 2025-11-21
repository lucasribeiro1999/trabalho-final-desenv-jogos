export class Upgrade {
    constructor(id, level = 0) {
        this.id = id
        this.level = level
    }

    isMaxedOut() {
        return this.level >= 3
    }

    buyNewLevel() {
        if (this.level >= 3) return

        this.level += 1;
    }
}