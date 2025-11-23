import * as me from 'melonjs'
import { UpgradeSystem } from '../managers/upgradeSystem';

me.state.UPGRADE_SELECTION = 0;

export class UpgradeSelectionScreen extends me.Stage {
    onResetEvent() {
        me.game.world.backgroundColor.parseCSS("#17171F");

        // Título principal com fonte Micro 5
        const title = new me.Text(
            me.game.viewport.width / 2, 
            80, 
            {
                text: "Choose your upgrade!",
                font: "Micro 5",
                size: 48,
                fillStyle: "#FFD700",
                strokeStyle: "#000000",
                lineWidth: 4,
                textAlign: "center",
                textBaseline: "middle"
            }
        );
        title.anchorPoint.set(0.5, 0.5);
        me.game.world.addChild(title);

        // Subtítulo opcional
        const subtitle = new me.Text(
            me.game.viewport.width / 2,
            140,
            {
                text: "Select one to continue",
                font: "Micro 5",
                size: 20,
                fillStyle: "#CCCCCC",
                textAlign: "center",
                textBaseline: "middle"
            }
        );
        subtitle.anchorPoint.set(0.5, 0.5);
        me.game.world.addChild(subtitle);

        const upgradeSystem = new UpgradeSystem()
        me.game.world.addChild(upgradeSystem, 9999)
    }
}