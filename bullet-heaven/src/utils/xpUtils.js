import CONSTANTS from "../constants.js";
import { GameData } from "../gameData.js";

/**
 * Centralized weapon level update logic
 * @param {string} weaponType - pistol, rifle, or shotgun
 * @param {number} newLevel - the level to apply
 * @returns {number} - the final level after applying the logic
 */
export function updateWeaponLevel(weaponType, newLevel) {
    const currentLevel = GameData.weaponLevels[weaponType] ?? 1;

    if (newLevel === currentLevel) {
        // Same level: add +1
        const finalLevel = Math.min(currentLevel + 1, CONSTANTS.LEVEL.MAX_WEAPON_LEVEL);
        GameData.weaponLevels[weaponType] = finalLevel;
        console.log(`${weaponType} (mesmo nível): ${currentLevel} -> ${finalLevel}`);
        return finalLevel;
    } else if (newLevel > currentLevel) {
        // Higher level: replace
        GameData.weaponLevels[weaponType] = newLevel;
        console.log(`${weaponType} (nível maior): ${currentLevel} -> ${newLevel}`);
        return newLevel;
    } else {
        // Lower level: ignore
        console.log(`${weaponType} (nível menor ignorado): atual ${currentLevel}, novo ${newLevel}`);
        return currentLevel;
    }
}

export function recalculateWeaponLevelsFromXP() {
    const { XP_PER_LEVEL, MAX_WEAPON_LEVEL } = CONSTANTS.LEVEL;

    // Somente pistola sobe de nível por XP
    const pistolLevel = Math.min(
        MAX_WEAPON_LEVEL,
        Math.floor(GameData.xp / XP_PER_LEVEL) + 1
    );

    const previous = GameData.weaponLevels.pistol;

    // Use centralized logic for pistol XP leveling
    updateWeaponLevel("pistol", pistolLevel);

    if (previous !== pistolLevel) {
        console.log(`PISTOL LEVEL UP! Novo nível: ${pistolLevel}`);
    }
}
