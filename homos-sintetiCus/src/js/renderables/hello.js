import * as me from "melonjs";

export class HelloText extends me.Renderable {
  constructor() {
    super(0, 0, me.game.viewport.width, me.game.viewport.height);
    this.anchorPoint.set(0, 0);
    this.font = new me.Text(0, 0, {
      font: "Arial",
      size: 48,
      fillStyle: "#FFFFFF",
      textBaseline: "middle",
      textAlign: "center"
    });
  }
  draw(renderer) {
    this.font.draw(renderer, "Hello melonJS!", me.game.viewport.width / 2, me.game.viewport.height / 2);
  }
}
