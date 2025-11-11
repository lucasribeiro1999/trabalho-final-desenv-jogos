import * as me from 'melonjs';
import CONSTANTS from '../constants.js';

// tamanhos
const VERT_W = CONSTANTS.LASER.WIDTH;
const VERT_H = CONSTANTS.LASER.HEIGHT;
const HORZ_W = CONSTANTS.LASER.HEIGHT;
const HORZ_H = CONSTANTS.LASER.WIDTH;
const DIAG  = CONSTANTS.LASER.HEIGHT * 0.75; // quadrado para diagonais

export class Laser extends me.Renderable {
  /**
   * @param {number} cx centro X do spawn
   * @param {number} cy centro Y do spawn
   * @param {number} dirX direção X (-1..1)
   * @param {number} dirY direção Y (-1..1)
   */
  constructor(cx, cy, dirX = 0, dirY = -1) {
    super(0, 0, VERT_W, VERT_H);

    this.speed = 900; // px/s (um tico mais rápido)
    this.dirX = 0;
    this.dirY = -1;

    this.body = new me.Body(this);
    this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;
    this.body.ignoreGravity = true;
    this.alwaysUpdate = true;

    if (typeof cx === "number" && typeof cy === "number") {
      this.onResetEvent(cx, cy, dirX, dirY);
    } else {
      this._applyOrientation("vertical");
      this.pos.set(-9999, -9999);
    }
  }

  _applyOrientation(kind) {
    if (kind === "horizontal") {
      this.width = HORZ_W; this.height = HORZ_H;
    } else if (kind === "vertical") {
      this.width = VERT_W; this.height = VERT_H;
    } else { // diagonal
      this.width = DIAG; this.height = DIAG;
    }
    this.body.shapes = [];
    this.body.addShape(new me.Rect(0, 0, this.width, this.height));
  }

  _setCenter(cx, cy) {
    this.pos.x = cx - this.width / 2;
    this.pos.y = cy - this.height / 2;
  }

  onResetEvent(cx, cy, dirX = 0, dirY = -1) {
    // normaliza para 8 direções
    let dx = dirX, dy = dirY;
    if (dx !== 0 || dy !== 0) {
      const len = Math.hypot(dx, dy);
      dx /= len; dy /= len; // agora -1/√2, 0, 1/√2 etc.
    } else {
      dx = 0; dy = -1;
    }
    this.dirX = dx;
    this.dirY = dy;

    const isDiagonal = dx !== 0 && dy !== 0;
    const kind = isDiagonal ? "diagonal" : (dx !== 0 ? "horizontal" : "vertical");
    this._applyOrientation(kind);
    this._setCenter(cx, cy);
  }

  update(dt) {
    const d = (this.speed * dt) / 1000;
    this.pos.x += this.dirX * d;
    this.pos.y += this.dirY * d;

    const w = me.game.viewport.width;
    const h = me.game.viewport.height;
    const m = 64;
    if (this.pos.x < -m || this.pos.x > w + m || this.pos.y < -m || this.pos.y > h + m) {
      me.game.world.removeChild(this);
    }

    return super.update(dt);
  }

  onCollision(response, other) {
    if (other.body.collisionType === me.collision.types.ENEMY_OBJECT) {
      me.game.world.removeChild(this);
      return false;
    }
  }

  draw(renderer) {
    const color = renderer.getColor();
    renderer.setColor('#5EFF7E');
    renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    renderer.setColor(color);
  }
}

export default Laser;
