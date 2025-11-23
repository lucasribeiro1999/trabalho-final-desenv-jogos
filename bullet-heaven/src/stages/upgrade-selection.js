import * as me from 'melonjs'

import { UpgradeSystem } from '../managers/upgradeSystem';

import CONSTANTS from '../constants';

me.state.UPGRADE_SELECTION = 0;

export class UpgradeSelectionScreen extends me.Stage {
    onResetEvent() {
        me.game.world.backgroundColor.parseCSS("#17171F");

        const title = new me.Text(
            me.game.viewport.width / 2,
            130,
            {
                text: "Choose your upgrade!",
                font: "Micro 5",
                size: 72,
                fillStyle: CONSTANTS.COLORS.YELLOW,
                strokeStyle: "#000000",
                lineWidth: 0,
                textAlign: "center",
                textBaseline: "middle"
            }
        );
        title.anchorPoint.set(0.5, 0.5);
        me.game.world.addChild(title);

        const subtitle = new me.Text(
            me.game.viewport.width / 2,
            210,
            {
                text: "Select one to continue",
                font: "Micro 5",
                size: 48,
                fillStyle: CONSTANTS.COLORS.WHITE,
                strokeStyle: "#000000",
                lineWidth: 0,
                textAlign: "center",
                textBaseline: "middle"
            }
        );
        subtitle.anchorPoint.set(0.5, 0.5);
        me.game.world.addChild(subtitle);

        const upgradeSystem = new UpgradeSystem(450)
        me.game.world.addChild(upgradeSystem, 9999)
    }
}