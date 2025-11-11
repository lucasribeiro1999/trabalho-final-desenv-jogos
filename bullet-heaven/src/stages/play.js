import * as me from 'melonjs';
import PlayerEntity from "../renderables/player.js";
import EnemyManager from "../managers/enemy-manager.js";

class PlayScreen extends me.Stage {
  onResetEvent() {
    me.game.world.backgroundColor.parseCSS("#000000");

    this.player = new PlayerEntity();
    me.game.world.addChild(this.player, 1);

    this.enemyManager = new EnemyManager(this.player);
    this.enemyManager.startSpawner({ rate: 800, rMin: 220, rMax: 380, maxOnScreen: 25 });
    me.game.world.addChild(this.enemyManager, 2);

    // ===== MOVIMENTO: WASD =====
    me.input.bindKey(me.input.KEY.A, "left");
    me.input.bindKey(me.input.KEY.D, "right");
    me.input.bindKey(me.input.KEY.W, "up");
    me.input.bindKey(me.input.KEY.S, "down");

    // NADA de setas no movimento!
    // me.input.bindKey(me.input.KEY.LEFT,  "left");   // REMOVIDO
    // me.input.bindKey(me.input.KEY.RIGHT, "right");  // REMOVIDO
    // me.input.bindKey(me.input.KEY.UP,    "up");     // REMOVIDO
    // me.input.bindKey(me.input.KEY.DOWN,  "down");   // REMOVIDO

    // ===== TIRO: SETAS ===== (segurar para auto-fire; sem o terceiro param "true")
    me.input.bindKey(me.input.KEY.LEFT,  "aim_left");
    me.input.bindKey(me.input.KEY.RIGHT, "aim_right");
    me.input.bindKey(me.input.KEY.UP,    "aim_up");
    me.input.bindKey(me.input.KEY.DOWN,  "aim_down");
  }

  onDestroyEvent() {
    // WASD
    me.input.unbindKey(me.input.KEY.A);
    me.input.unbindKey(me.input.KEY.D);
    me.input.unbindKey(me.input.KEY.W);
    me.input.unbindKey(me.input.KEY.S);

    // SETAS (aim)
    me.input.unbindKey(me.input.KEY.LEFT);
    me.input.unbindKey(me.input.KEY.RIGHT);
    me.input.unbindKey(me.input.KEY.UP);
    me.input.unbindKey(me.input.KEY.DOWN);
  }
}

export default PlayScreen;
