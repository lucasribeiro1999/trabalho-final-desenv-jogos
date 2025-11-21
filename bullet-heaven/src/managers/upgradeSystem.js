import * as me from 'melonjs'

import { pickXValuesRandomly } from '../renderables/utils/pickXValuesRandomly';

import CONSTANTS from '../constants'
import { GameData } from '../gameData';
import { UpgradeCard } from '../renderables/ui/upgradeCard';
import { Upgrade } from '../domain/models/upgrade';

const UPGRADES = [CONSTANTS.UPGRADES.HEAL, CONSTANTS.UPGRADES.LUCK_INCREASE, CONSTANTS.UPGRADES.MORE_MAX_HEALTH, CONSTANTS.UPGRADES.MOVE_SPEED_INCREASE, CONSTANTS.UPGRADES.XP_DROP_INCREASE]

function storeUpgradeToGameData(id) {
    if (id === CONSTANTS.UPGRADES.HEAL) {
        GameData.player.healDamage();

    } else {
        if (!GameData.activeUpgrades.has(id)) GameData.activeUpgrades.set(id, new Upgrade(id, 0))

        const upgrade = GameData.activeUpgrades.get(id)

        upgrade.buyNewLevel()
    }

    me.state.change(me.state.PLAY, () => {
        this.children?.forEach(child => {
            if (child instanceof UpgradeCard) {
                this.removeChild(child);
            }

            GameData.healthSystem.renderHearts()
        });
    });
}

export class UpgradeSystem extends me.Container {
    constructor() {
        super(0, 0, me.game.viewport.width, me.game.viewport.height);

        this.drawUpgradeOptions()
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

        const cardPositionY = (me.game.viewport.height / 2) - 32

        const middleCardPositionX = me.game.viewport.width / 2

        const middleCard = new UpgradeCard(middleCardPositionX, cardPositionY, upgradesToRender[0], () => storeUpgradeToGameData(upgradesToRender[0]))
        me.game.world.addChild(middleCard);

        const leftCardPositionX = middleCardPositionX - (cardWidth) - cardSpacing

        const leftCard = new UpgradeCard(leftCardPositionX, cardPositionY, upgradesToRender[1], () => storeUpgradeToGameData(upgradesToRender[1]))
        me.game.world.addChild(leftCard);

        const rightCardPositionX = middleCardPositionX + (cardWidth) + cardSpacing

        const rightCard = new UpgradeCard(rightCardPositionX, cardPositionY, upgradesToRender[2], () => storeUpgradeToGameData(upgradesToRender[2]))
        me.game.world.addChild(rightCard);
    }
}