import * as me from 'melonjs';
import { DebugPanelPlugin } from '@melonjs/debug-plugin';

import PlayScreen from './stages/play.js';
import GameOverScreen from './stages/gameOver.js';
import { UpgradeSelectionScreen } from './stages/upgrade-selection.js';

import Laser from './renderables/laser.js';
import { GAME_RESOURCES } from './assets/resources';

export default function onload() {
    if (!me.video.init(960, 720, { parent: "screen", scale: "auto", scaleMethod: "flex-width" })) {
        alert("Your browser does not support HTML5 canvas.");
        return;
    }

    me.plugin.register(DebugPanelPlugin, "debugPanel");

    me.audio.init("mp3,ogg");

    me.loader.setOptions({ crossOrigin: "anonymous" });

    me.loader.preload(GAME_RESOURCES, function () {
        me.state.set(me.state.PLAY, new PlayScreen());
        me.state.set(me.state.GAMEOVER, new GameOverScreen());
        me.state.set(me.state.UPGRADE_SELECTION, new UpgradeSelectionScreen());

        me.pool.register("laser", Laser, true);

        me.state.change(me.state.PLAY);
    });
};
