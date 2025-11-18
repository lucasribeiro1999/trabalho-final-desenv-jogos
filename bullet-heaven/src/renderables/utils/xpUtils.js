import CONSTANTS from "../../constants.js";
import { GameData } from "../../gameData.js";

export function recalculateWeaponLevelsFromXP() {
    const { XP_PER_LEVEL, MAX_WEAPON_LEVEL } = CONSTANTS.LEVEL;

    // Somente pistola sobe de nível
    const pistolLevel = Math.min(
        MAX_WEAPON_LEVEL,
        Math.floor(GameData.xp / XP_PER_LEVEL) + 1
    );
    const previous = GameData.weaponLevels.pistol;

    GameData.weaponLevels.pistol = pistolLevel;
    GameData.weaponLevels.rifle = 1;
    GameData.weaponLevels.shotgun = 1;

    if (previous !== pistolLevel) {
        console.log(`PISTOL LEVEL UP! Novo nível: ${pistolLevel}`);
    }
}
