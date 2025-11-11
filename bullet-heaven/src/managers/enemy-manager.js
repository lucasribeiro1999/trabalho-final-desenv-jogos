import * as me from 'melonjs';
import EnemyEntity from './../renderables/enemy.js';

class EnemyManager extends me.Container {
  static DEFAULTS = {
    rate: 800,
    rMin: 220,
    rMax: 380,
    maxOnScreen: 25,
  };

  constructor(player) {
    super(0, 0, me.game.viewport.width, me.game.viewport.height);
    this.player = player;
    this.enableChildBoundsUpdate = true;
    this._cfg = { ...EnemyManager.DEFAULTS };
    this.timer = null;
  }

  startSpawner(cfg = {}) {
    this._cfg = { ...this._cfg, ...cfg };

    if (this.timer) me.timer.clearInterval(this.timer);

    this.timer = me.timer.setInterval(() => {
      if (this.children.length >= this._cfg.maxOnScreen) return;

      const angle = me.Math.randomFloat(0, Math.PI * 2);
      const radius = me.Math.randomFloat(this._cfg.rMin, this._cfg.rMax);
      const pBounds = this.player.getBounds();
      const spawnX = pBounds.centerX + Math.cos(angle) * radius;
      const spawnY = pBounds.centerY + Math.sin(angle) * radius;

      const enemy = new EnemyEntity(spawnX, spawnY);
      enemy.setTarget(this.player);
      this.addChild(enemy);
    }, this._cfg.rate);
  }

  onDeactivateEvent() {
    if (this.timer) {
      me.timer.clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export default EnemyManager;
