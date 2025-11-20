import * as me from 'melonjs'

me.state.UPGRADE_SELECTION = 0;

export class UpgradeSelectionScreen extends me.Stage {
    onResetEvent() {
        const text = new me.Text(0, 0, {
            text: "Choose your upgrade!",
            font: "Arial",
            size: 32,
            fillStyle: "#fff",
        });
        text.pos.set(me.game.viewport.width / 2, me.game.viewport.height / 2);
        me.game.world.addChild(text);

        const button = new me.GUI_Object(
            me.game.viewport.width / 2 - 50,
            me.game.viewport.height / 2 + 50,
            { image: me.loader.getImage("button-not-pressed") }
        );
        button.onClick = () => {
            me.state.change(me.state.PLAY);
        };
        me.game.world.addChild(button);
    }
}