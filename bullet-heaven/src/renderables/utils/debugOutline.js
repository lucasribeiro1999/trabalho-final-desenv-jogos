export class DebugOutline extends me.Renderable {
    constructor(container) {
        super(container.pos.x, container.pos.y, container.width, container.height);
        this.container = container;
    }

    draw(renderer) {
        renderer.setColor("red");
        renderer.strokeRect(
            this.container.pos.x,
            this.container.pos.y,
            this.container.width,
            this.container.height
        );
    }
}