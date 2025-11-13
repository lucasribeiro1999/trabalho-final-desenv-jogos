import * as me from "melonjs";
import WeaponHud from "./weaponHud.js";

class WeaponHudContainer extends me.Container {
    constructor(player) {
        super();
        this.isPersistent = true;
        this.floating = true; // Sempre na tela, não no mundo
        this.name = "WeaponHudContainer";
        this.addChild(new WeaponHud(player));
    }
}
export default WeaponHudContainer;
