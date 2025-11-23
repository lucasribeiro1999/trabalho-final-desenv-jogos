import * as me from 'melonjs'

import { UpgradeSystem } from '../managers/upgradeSystem';

import { RerollButton } from '../renderables/ui/rerollButton';
import XPHUD from '../renderables/ui/xpHud';

import CONSTANTS from '../constants';
import { GameData } from '../gameData';

me.state.UPGRADE_SELECTION = 0;

export class UpgradeSelectionScreen extends me.Stage {
    onResetEvent() {
        me.game.world.backgroundColor.parseCSS("#17171F");

        const title = new me.Text(
            me.game.viewport.width / 2,
            130,
            {
                text: "Escolha seu upgrade!",
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
                text: "Escolha um para continuar",
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

        GameData.upgradeSystem = new UpgradeSystem(450)
        me.game.world.addChild(GameData.upgradeSystem, 9999)

        // XP HUD
        const xpHud = new XPHUD();
        me.game.world.addChild(xpHud, 9999);

        const rerollBtn = new RerollButton(me.game.viewport.width / 2, me.game.viewport.height - 50);
        me.game.world.addChild(rerollBtn);

        me.input.registerPointerEvent("pointerdown", rerollBtn, () => rerollBtn.onClick());
        this.rerollBtn = rerollBtn;
    }

    onDestroyEvent() {
        if (this.rerollBtn) {
            me.input.releasePointerEvent("pointerdown", this.rerollBtn);
        }
    }
}