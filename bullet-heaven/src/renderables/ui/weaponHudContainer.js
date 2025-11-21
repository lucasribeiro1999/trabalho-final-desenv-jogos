import * as me from "melonjs";

import WeaponHud from "./weaponHud.js";

import CONSTANTS from '../../constants.js'

const WEAPONS = [CONSTANTS.WEAPONS.PISTOL.NAME, CONSTANTS.WEAPONS.RIFLE.NAME, CONSTANTS.WEAPONS.SHOTGUN.NAME]

class WeaponHudContainer extends me.Container {
    constructor(player) {
        super((me.game.viewport.width / 2) - 80, me.game.viewport.height - 30 - 30, 160, 60);

        this.player = player;

        this.isPersistent = true;
        this.floating = true;
        this.name = "WeaponHudContainer";

        this.renderWeaponSlots()
    }

    renderWeaponSlots() {
        for (let i = 0; i < WEAPONS.length; i++) {
            const x = (i * (60 + 20));
            const y = 0;

            const weaponSlot = new WeaponHud(x, y, this.player, WEAPONS[i], this, true)

            this.addChild(weaponSlot);
        }
    }
}
export default WeaponHudContainer;
