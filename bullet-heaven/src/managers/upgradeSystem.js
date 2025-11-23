import * as me from 'melonjs'

import { pickXValuesRandomly } from '../utils/pickXValuesRandomly';

import CONSTANTS from '../constants'
import { GameData } from '../gameData';
import { UpgradeCard } from '../renderables/ui/upgradeCard';
import { Upgrade } from '../domain/models/upgrade';

const UPGRADES = [CONSTANTS.UPGRADES.HEAL, CONSTANTS.UPGRADES.LUCK_INCREASE, CONSTANTS.UPGRADES.MORE_MAX_HEALTH, CONSTANTS.UPGRADES.MOVE_SPEED_INCREASE, CONSTANTS.UPGRADES.XP_DROP_INCREASE]

export class UpgradeSystem extends me.Container {
    constructor(cardY) {
        super(0, 0, me.game.viewport.width, me.game.viewport.height);
        this.cardY = cardY || (me.game.viewport.height / 2);
        this.currentCards = [];
        this.drawUpgradeOptions()
    }

    storeUpgradeToGameData(id) {
        if (id === CONSTANTS.UPGRADES.HEAL) {
            const maxHealthUpgrade = GameData.activeUpgrades.get(CONSTANTS.UPGRADES.MORE_MAX_HEALTH);
            const maxHealthLevel = maxHealthUpgrade?.level ?? 0;
            const maxHealth = CONSTANTS.PLAYER.MAX_HEALTH + maxHealthLevel;

            GameData.currentHealth = Math.min(GameData.currentHealth + 1, maxHealth);
        } else {
            if (!GameData.activeUpgrades.has(id)) GameData.activeUpgrades.set(id, new Upgrade(id, 0))

            const upgrade = GameData.activeUpgrades.get(id)

            upgrade.buyNewLevel()

            if (id === CONSTANTS.UPGRADES.MORE_MAX_HEALTH) {
                GameData.currentHealth = Math.min(GameData.currentHealth + 1, CONSTANTS.PLAYER.MAX_HEALTH + upgrade.level);
            }
        }

        // Remove cards before changing state
        this.clearCards();

        me.state.change(me.state.PLAY, () => {
            GameData.healthSystem.renderHearts()
        });
    }

    clearCards() {
        this.currentCards.forEach(card => {
            me.game.world.removeChild(card);
        });
        this.currentCards = [];
    }

    drawUpgradeOptions() {
        const maxedOutUpgrades = [];

        for (const activeUpgrade of GameData.activeUpgrades.values()) {
            if (!activeUpgrade.isMaxedOut()) maxedOutUpgrades.push(activeUpgrade)
        }

        const choosenUpgrades = pickXValuesRandomly(UPGRADES, 3);

        this.renderUpgrades(choosenUpgrades)
    }

    renderUpgrades(upgradesToRender) {
        if (upgradesToRender?.length !== 3) return

        const cardWidth = 235
        const cardSpacing = 70

        const cardPositionY = this.cardY

        const middleCardPositionX = me.game.viewport.width / 2

        const middleCard = new UpgradeCard(middleCardPositionX, cardPositionY, upgradesToRender[0], () => this.storeUpgradeToGameData(upgradesToRender[0]))
        me.game.world.addChild(middleCard);
        this.currentCards.push(middleCard);

        const leftCardPositionX = middleCardPositionX - (cardWidth) - cardSpacing

        const leftCard = new UpgradeCard(leftCardPositionX, cardPositionY, upgradesToRender[1], () => this.storeUpgradeToGameData(upgradesToRender[1]))
        me.game.world.addChild(leftCard);
        this.currentCards.push(leftCard);

        const rightCardPositionX = middleCardPositionX + (cardWidth) + cardSpacing

        const rightCard = new UpgradeCard(rightCardPositionX, cardPositionY, upgradesToRender[2], () => this.storeUpgradeToGameData(upgradesToRender[2]))
        me.game.world.addChild(rightCard);
        this.currentCards.push(rightCard);
    }

    reroll() {
        if (GameData.xp >= CONSTANTS.XP.REROLL_COST) {
            GameData.xp -= CONSTANTS.XP.REROLL_COST;

            this.clearCards();

            this.drawUpgradeOptions();
            return true;
        }
        return false;
    }
}