import * as me from 'melonjs';

export class HealtPoint extends me.Sprite {
    constructor(x, y) {
        super(x, y, { image: "heart", framewidth: 11.5, frameheight: 9 });

        this.scale(3)

        this.addAnimation("full", [0]);
        this.addAnimation("empty", [1]);
        this.setCurrentAnimation("full");
    }

    takeDamage() {
        this.setCurrentAnimation("empty");
    }

    healDamage() {
        this.setCurrentAnimation("full");
    }
}