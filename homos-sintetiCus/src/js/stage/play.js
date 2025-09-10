import * as me from "melonjs";
import { HelloText } from "../renderables/hello.js";

export class PlayScreen extends me.Stage {
  onResetEvent() {
    me.game.world.addChild(new HelloText());
  }
  onDestroyEvent() {}
}
