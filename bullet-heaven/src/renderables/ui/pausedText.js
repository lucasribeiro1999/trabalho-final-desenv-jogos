import * as me from "melonjs";

class PausedText extends me.Renderable {
    constructor() {
        // Centraliza o renderable no centro do viewport
        super(
            me.game.viewport.width / 2,
            me.game.viewport.height / 2,
            1,
            1
        );

        // O ponto de referência é o centro do renderable
        this.anchorPoint.set(0.5, 0.5);

        // Texto da mensagem de pausa
        this.text = "Jogo pausado";

        // Instância do renderizável de texto (passa o texto pelo parâmetro 'value')
        this.textRenderable = new me.Text(0, 0, {
            font: "Arial",
            size: 48,
            fillStyle: "#FFFFFF",
            textAlign: "center",
            value: this.text // O texto é passado desta forma nas versões recentes!
        });
    }

    update(dt) {
        // Não precisa de update contínuo
        return false;
    }

    // draw é chamado com o renderer já posicionado nas coordenadas do renderable
    draw(renderer) {
        // Mede as dimensões do texto a ser renderizado
        const metrics = this.textRenderable.measureText(renderer);

        const boxWidth  = metrics.width + 64;
        const boxHeight = metrics.height + 32;

        // Centro do viewport já está fixo em this.pos.x, this.pos.y
        const cx = this.pos.x;
        const cy = this.pos.y;

        // Fundo preto translúcido
        renderer.save();
        renderer.setGlobalAlpha(0.8);
        renderer.setColor("#000000");
        renderer.fillRect(
            cx - boxWidth / 2,
            cy - boxHeight / 2,
            boxWidth,
            boxHeight
        );
        renderer.restore();

        // Centraliza o texto exatamente no centro da tela
        this.textRenderable.draw(
            renderer,
            cx,
            cy
        );
    }
}

export default PausedText;
