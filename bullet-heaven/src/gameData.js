import CONSTANTS from './constants.js';

export const GameData = {
    // XP total acumulado
    xp: 0,

    // níveis das armas
    weaponLevels: {
        pistol: 1,
        rifle: 0,
        shotgun: 0
    },

    // wave atual
    currentWave: 0,

    // upgrades ativos (Map de id -> Upgrade)
    activeUpgrades: new Map(),

    // arma atualmente selecionada (0 = pistol, 1 = rifle, 2 = shotgun)
    currentWeaponSlot: 0,

    // vida atual do jogador
    currentHealth: CONSTANTS.PLAYER.MAX_HEALTH,

    // posição salva do player para voltar após tela de upgrade
    savedPlayerPos: null,

    // referências úteis que o jogo vai preenchendo
    player: null,
    healthSystem: null,

    // flag para saber se é um "novo jogo" (primeira vez ou após GAME OVER)
    isNewRun: true,

    // armas dropadas no chão que precisam persistir entre stages
    droppedWeapons: []
};
