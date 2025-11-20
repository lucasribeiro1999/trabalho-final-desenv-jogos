import * as me from "melonjs"

export class UpgradeCard extends me.UISpriteElement {
    constructor(x, y, id, onUpgradeSelection) {
        super(x, y, {
            image: me.loader.getImage(id),
            framewidth: 235,
            frameheight: 352
        });

        this.onClick = () => {
            onUpgradeSelection();
        };
    }
}
