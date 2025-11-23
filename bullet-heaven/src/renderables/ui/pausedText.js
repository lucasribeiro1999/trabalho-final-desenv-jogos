import * as me from 'melonjs';

class PausedText extends me.Renderable {
    constructor() {
        super(
            me.game.viewport.width / 2,
            me.game.viewport.height / 2,
            300,
            150
        );

        this.floating = true;
        this.anchorPoint.set(0.5, 0.5);

        // Texto principal PAUSED
        this.pausedText = new me.Text(0, 0, {
            font: "Micro 5",
            size: 64,
            fillStyle: "#FFFFFF",
            strokeStyle: "#000000",
            lineWidth: 5,
            textAlign: "center",
            textBaseline: "middle",
            text: "PAUSADO"
        });

        // Texto de instrução
        this.instructionText = new me.Text(0, 60, {
            font: "Micro 5",
            size: 20,
            fillStyle: "#CCCCCC",
            textAlign: "center",
            textBaseline: "middle",
            text: "Aperte P para retornar ao jogo"
        });
    }

    draw(renderer) {
        const x = this.pos.x - this.width / 2;
        const y = this.pos.y - this.height / 2;

        // Fundo semi-transparente escuro
        renderer.save();
        renderer.setGlobalAlpha(0.8);
        renderer.setColor("#000000");
        renderer.fillRect(x, y, this.width, this.height);
        renderer.restore();

        // Borda ao redor do painel (4px de largura desenhando 4 retângulos)
        renderer.setColor("#FFD700");
        const borderWidth = 4;
        // Topo
        renderer.fillRect(x, y, this.width, borderWidth);
        // Baixo
        renderer.fillRect(x, y + this.height - borderWidth, this.width, borderWidth);
        // Esquerda
        renderer.fillRect(x, y, borderWidth, this.height);
        // Direita
        renderer.fillRect(x + this.width - borderWidth, y, borderWidth, this.height);

        // Desenha os textos
        this.pausedText.draw(renderer, this.pos.x, this.pos.y - 20);
        this.instructionText.draw(renderer, this.pos.x, this.pos.y + 40);
    }

    update(dt) {
        return true;
    }
}

export default PausedText;