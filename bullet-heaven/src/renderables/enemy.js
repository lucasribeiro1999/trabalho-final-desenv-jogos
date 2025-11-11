import * as me from 'melonjs';

class EnemyEntity extends me.Sprite {
  constructor(x, y) {
    super(x, y, {
      image: "zombie-axe",
      framewidth: 13,
      frameheight: 18,
    });

    this.body = new me.Body(this);
    this.body.addShape(new me.Rect(0, 0, this.width, this.height));
    this.body.collisionType = me.collision.types.ENEMY_OBJECT;
    this.body.setCollisionMask(
      me.collision.types.PLAYER_OBJECT | me.collision.types.PROJECTILE_OBJECT
    );
    this.body.ignoreGravity = true;

    this.speed = 80 + me.Math.random(0, 40);

    this.addAnimation("idle", [me.Math.random(0, 4)], 1);
    this.setCurrentAnimation("idle");

    this.target = null;
  }

  setTarget(sprite) {
    this.target = sprite;
  }

  update(dt) {
    super.update(dt);

    if (this.target) {
      const t = this.target.getBounds();
      const b = this.getBounds();
      let dx = t.centerX - b.centerX;
      let dy = t.centerY - b.centerY;
      const len = Math.hypot(dx, dy);
      if (len > 0.0001) {
        const v = (this.speed * dt) / 1000;
        this.pos.x += (dx / len) * v;
        this.pos.y += (dy / len) * v;
      }
    }
    return true;
  }

  onCollision(response, other) {
    if (other.body.collisionType === me.collision.types.PROJECTILE_OBJECT) {
      this.ancestor?.removeChild(this);
      return false;
    }
    if (other.body.collisionType === me.collision.types.PLAYER_OBJECT) {
      return false;
    }
  }
}

export default EnemyEntity;
