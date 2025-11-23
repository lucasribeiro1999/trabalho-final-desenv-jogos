import { WEAPON_DROP_RARITIES } from "../constants.js";

/**
 * Tenta calcular um drop de arma.
 * - Usa o upgrade de sorte para aumentar a chance.
 * - Escolhe raridade com base em WEAPON_DROP_RARITIES.
 * - Escolhe arma (pistol, rifle, shotgun).
 *
 * @param {number} luckLevel - Nível de sorte do jogador (0 a N)
 * @returns {object|null} - Retorna objeto { type, level, rarity } ou null se falhar
 */
export function tryCalculateDrop(luckLevel = 0) {
    const dropChance = 0.10 + (luckLevel * 0.05);

    // Falhou o roll de drop? Retorna null.
    if (Math.random() >= dropChance) {
        return null;
    }

    // Escolhe raridade com base nas chances
    let roll = Math.random() * 100;
    let acc = 0;
    let chosenRarity = WEAPON_DROP_RARITIES[0];

    for (const rarity of WEAPON_DROP_RARITIES) {
        acc += rarity.chance;
        if (roll < acc) {
            chosenRarity = rarity;
            break;
        }
    }

    // Escolhe a arma
    const weaponTypes = ["pistol", "rifle", "shotgun"];
    const type = weaponTypes[Math.floor(Math.random() * weaponTypes.length)];

    // Nível da arma com base na raridade
    const level = (chosenRarity.minLevel === chosenRarity.maxLevel)
        ? chosenRarity.maxLevel
        : chosenRarity.minLevel + Math.floor(Math.random() * (chosenRarity.maxLevel - chosenRarity.minLevel + 1));

    return {
        type: type,
        level: level,
        rarity: chosenRarity.type
    };
}
