import * as me from 'melonjs'

import { UpgradeSystem } from '../managers/upgradeSystem';

me.state.UPGRADE_SELECTION = 0;

export class UpgradeSelectionScreen extends me.Stage {
    onResetEvent() {
        me.game.world.backgroundColor.parseCSS("#17171F");

        const text = new me.Text((me.game.viewport.width / 2) - 144, 64, {
            text: "Choose your upgrade!",
            font: "Arial",
            size: 32,
            fillStyle: "#fff",
        });
        me.game.world.addChild(text);

        const upgradeSystem = new UpgradeSystem()
        me.game.world.addChild(upgradeSystem, 9999)
    }
}