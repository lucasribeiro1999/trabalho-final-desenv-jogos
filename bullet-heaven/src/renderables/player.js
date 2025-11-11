import * as me from 'melonjs';
import CONSTANTS from '../constants.js';

class PlayerEntity extends me.Sprite {
  constructor() {
    const image = me.loader.getImage("player");
    super(
      me.game.viewport.width / 2 - image.width / 2,
      me.game.viewport.height - image.height - 20,
      { image, framewidth: 13, frameheight: 16 }
    );

    // movimento
    this.velx = 450;
    this.vely = 450;

    // limites
    this.minX = 32;
    this.maxX = me.game.viewport.width - this.width;
    this.minY = 0;
    this.maxY = me.game.viewport.height - this.height - 20;

    // física
    this.body = new me.Body(this);
    this.body.addShape(new me.Rect(0, 0, this.width, this.height));
    this.body.collisionType = me.collision.types.PLAYER_OBJECT;
    this.body.setCollisionMask(me.collision.types.ENEMY_OBJECT);
    this.body.ignoreGravity = true;
    this.alwaysUpdate = true;

    // vida
    this.maxHP = 3;
    this.hp = this.maxHP;
    this.iFrames = 0;

    // mira
    this.lastAimX = 0;
    this.lastAimY = -1; // default para cima
    this.fireCooldown = 0;                 // ms restante
    this.FIRE_COOLDOWN_MS = 120;           // cadência ~8.3 tiros/s
    this.SPAWN_OFFSET = 10;                // desloca spawn pra fora do sprite
  }

  takeDamage(amount = 1) {
    if (this.iFrames > 0) return;
    this.hp -= amount;
    this.iFrames = 800;
    this.flicker(800);
    if (this.hp <= 0) me.state.current().reset();
  }

  update(dt) {
    super.update(dt);
    const s = dt / 1000;
    if (this.iFrames > 0) this.iFrames -= dt;
    if (this.fireCooldown > 0) this.fireCooldown -= dt;

    // ===== MOVIMENTO (WASD) =====
    let dx = 0, dy = 0;
    if (me.input.isKeyPressed("left"))  dx -= this.velx * s;
    if (me.input.isKeyPressed("right")) dx += this.velx * s;
    if (me.input.isKeyPressed("up"))    dy -= this.vely * s;
    if (me.input.isKeyPressed("down"))  dy += this.vely * s;

    // normaliza diagonal de movimento
    if (dx && dy) { dx *= Math.SQRT1_2; dy *= Math.SQRT1_2; }
    this.pos.x += dx;
    this.pos.y += dy;

    // ===== MIRA / TIRO (SETAS) =====
    let aimX = 0, aimY = 0;
    if (me.input.isKeyPressed("aim_left"))  aimX -= 1;
    if (me.input.isKeyPressed("aim_right")) aimX += 1;
    if (me.input.isKeyPressed("aim_up"))    aimY -= 1;
    if (me.input.isKeyPressed("aim_down"))  aimY += 1;

    // se alguma seta está pressionada, atualiza a última mira
    if (aimX !== 0 || aimY !== 0) {
      // normaliza para 8 direções (cardinais e diagonais 45°)
      if (aimX && aimY) { aimX *= Math.SQRT1_2; aimY *= Math.SQRT1_2; }
      this.lastAimX = aimX;
      this.lastAimY = aimY;

      // dispara com cadência
      if (this.fireCooldown <= 0) {
        const b = this.getBounds();
        const cx = b.centerX + this.lastAimX * this.SPAWN_OFFSET;
        const cy = b.centerY + this.lastAimY * this.SPAWN_OFFSET;
        me.game.world.addChild(
          me.pool.pull("laser", cx, cy, this.lastAimX, this.lastAimY)
        );
        this.fireCooldown = this.FIRE_COOLDOWN_MS;
      }
    }

    // limites
    this.pos.x = me.Math.clamp(this.pos.x, this.minX, this.maxX);
    this.pos.y = me.Math.clamp(this.pos.y, this.minY, this.maxY);

    return true;
  }

  onCollision(response, other) {
    if (other.body.collisionType === me.collision.types.ENEMY_OBJECT) {
      this.takeDamage(1);
      return false;
    }
  }
}

export default PlayerEntity;
