import CONSTANTS, { WEAPON_DROP_RARITIES } from "../constants.js";
import { GameData } from "../gameData.js";

/**
 * Classe apenas lógica para gerenciar DROPS de arma.
 * Não é Sprite, não é Renderable, não é adicionada no world.
 */
class WeaponDropEntity {
    constructor() {
        // futuro: podemos receber configs aqui se precisar
    }

    /**
     * Tenta realizar um drop de arma.
     * - Usa o upgrade de sorte para aumentar a chance.
     * - Escolhe raridade com base em WEAPON_DROP_RARITIES.
     * - Escolhe arma (pistol, rifle, shotgun).
     * - Entrega diretamente para o player (sem sprite no mundo).
     *
     * @param {number} posX - posição X do zumbi (apenas para referência futura, se quiser FX)
     * @param {number} posY - posição Y do zumbi
     * @param {object} killerPlayer - opcional, player que matou; se não enviado, usa GameData.player
     */
    tryDrop(posX, posY, killerPlayer) {
        const luckUpgrade = GameData.activeUpgrades.get(CONSTANTS.UPGRADES.LUCK_INCREASE);
        const luckLevel = luckUpgrade?.level ?? 0;
        const dropChance = 0.10 + (luckLevel * 0.05);

        // Falhou o roll de drop? Retorna direto.
        if (Math.random() >= dropChance) {
            return;
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

        // Descobre qual player recebe (normalmente GameData.player)
        const player = killerPlayer || GameData.player;

        if (player && typeof player.addWeapon === "function") {
            player.addWeapon(type, level, chosenRarity.type);
        }

        // Debug opcional
        console.log(
            `[WeaponDropEntity] Drop gerado em (${posX.toFixed(0)},${posY.toFixed(0)}) -> ` +
            `${type} lvl ${level} (${chosenRarity.type})`
        );
    }
}

export default WeaponDropEntity;
