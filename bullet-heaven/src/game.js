import * as me from 'melonjs';
import { DebugPanelPlugin } from '@melonjs/debug-plugin';

import PlayScreen from './stages/play.js';
import Laser from './renderables/laser.js';
import { GAME_RESOURCES } from './assets/resources';

export default function onload() {
    // initialize the display canvas once the device/browser is ready
    if (!me.video.init(960, 720, { parent: "screen", scale: "auto", scaleMethod: "flex-width" })) {
        alert("Your browser does not support HTML5 canvas.");
        return;
    }

    // register the debug plugin
    me.plugin.register(DebugPanelPlugin, "debugPanel");

    // Initialize the audio.
    me.audio.init("mp3,ogg");

    // allow cross-origin for image/texture loading
    me.loader.setOptions({ crossOrigin: "anonymous" });

    // set and load all resources.
    me.loader.preload(GAME_RESOURCES, function () {
        // set the user defined game stages
        me.state.set(me.state.PLAY, new PlayScreen());

        // add our laser entity in the entity pool
        me.pool.register("laser", Laser, true);

        // Start the game.
        me.state.change(me.state.PLAY);
    });
};