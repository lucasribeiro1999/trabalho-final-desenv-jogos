import * as me from "melonjs";
import { DebugPanelPlugin } from "@melonjs/debug-plugin";

import PlayScreen from "./stages/play.js";
import GameOverScreen from "./stages/gameOver.js";
import { UpgradeSelectionScreen } from "./stages/upgrade-selection.js";

import Laser from "./renderables/laser.js";
import { GAME_RESOURCES } from "./assets/resources";

export default function onload() {
  // 👇 FORÇA RENDERER EM CANVAS PARA EVITAR "texture cache overflow"
  if (
    !me.video.init(960, 720, {
      parent: "screen",
      renderer: me.video.CANVAS, // <- aqui é o pulo do gato
      scale: "auto",
      scaleMethod: "flex-width",
      antiAlias: false
    })
  ) {
    alert("Your browser does not support HTML5 canvas.");
    return;
  }

  const renderer = me.video.renderer;
  if (renderer.settings.renderer === me.video.CANVAS) {
    const ctx = renderer.getContext();
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      ctx.msImageSmoothingEnabled = false;
    }
  }

  // Debug (pode tirar se quiser)
  me.plugin.register(DebugPanelPlugin, "debugPanel", {
    key: me.input.KEY.V
  });

  // Áudio'
  me.audio.init("mp3,ogg");

  // Assets externos
  me.loader.setOptions({ crossOrigin: "anonymous" });

  // Preload de recursos e setup dos estados
  me.loader.preload(GAME_RESOURCES, function () {
    // ⬇️ TOCA MÚSICA DE FUNDO EM LOOP
    // Parâmetros: (nome, loop, callback, volume)
    me.audio.play("gameplay-theme", true, null, 0.4);

    me.state.set(me.state.PLAY, new PlayScreen());
    me.state.set(me.state.GAMEOVER, new GameOverScreen());
    me.state.set(me.state.UPGRADE_SELECTION, new UpgradeSelectionScreen());

    me.pool.register("laser", Laser, true);

    me.state.change(me.state.PLAY);
  });
}