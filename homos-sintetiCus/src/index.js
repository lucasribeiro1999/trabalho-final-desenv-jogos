import * as me from "melonjs";
import manifest from "./manifest.js";
import { PlayScreen } from "./js/stage/play.js";

me.device.onReady(() => {
  // cria o canvas e inicia o renderer
  if (!me.video.init(800, 600, { parent: "screen", scale: "auto", renderer: me.video.AUTO })) {
    alert("Seu navegador não suporta HTML5 canvas.");
    return;
  }

  // carrega assets e depois entra no jogo
  me.loader.preload(manifest, () => {
    me.state.set(me.state.PLAY, new PlayScreen());
    me.state.change(me.state.PLAY);
  });
});
