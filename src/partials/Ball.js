import { SVG_NS } from '../settings';

export default class Ball {
    constructor(radius, boardWidth, boardHeight) {
        this.radius = radius;
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.direction = 1;
        this.ping = new Audio('public/sounds/pong-02.wav');
        this.gameOver = new Audio('public/sounds/pong-04.wav');

        this.reset();
    }

    wallCollision() {
        const hitLeft = this.x - this.radius <= 0;
        const hitRight = this.x + this.radius >= this.boardWidth;
        const hitTop = this.y - this.radius <= 0;
        const hitBottom = this.y + this.radius >= this.boardHeight;

        if (hitLeft || hitRight) {
            this.vx = -this.vx;
        } else if (hitTop || hitBottom) {
            this.vy = -this.vy;
        }
    }

    paddleCollision(player1, player2) {
        if (this.vx > 0) {
            let paddle = player2.coordinates(player2.x, player2.y, player2.width, player2.height);
            let [leftX, rightX, topY, bottomY] = paddle;
            if (
                this.x + this.radius >= leftX
                && this.x + this.radius <= rightX
                && this.y - this.radius >= topY
                && this.y - this.radius <= bottomY
            ) {
                this.vx = -this.vx;
                this.ping.play();
            }
        } else {
            let paddle = player1.coordinates(player1.x, player1.y, player1.width, player1.height);
            let [leftX, rightX, topY, bottomY] = paddle;
            if (
                this.x - this.radius <= rightX
                && this.x - this.radius >= leftX
                && this.y - this.radius >= topY
                && this.y - this.radius <= bottomY
            ) {
                this.vx = -this.vx;
                this.ping.play();

            }
        }
    }

    reset() {
        this.x = this.boardWidth / 2;
        this.y = this.boardHeight / 2;

        this.vy = 0;

        while (this.vy === 0) {
            this.vy = Math.floor(Math.random() * 10 - 5);
            this.vx = this.direction * (6 - Math.abs(this.vy));
        }
    }

    goal(player) {
        player.score++;
        this.reset();
    }

    restart() {
        window.location.reload();
    }

    render(svg, player1, player2) {
        this.x += this.vx;
        this.y += this.vy;

        this.wallCollision();
        this.paddleCollision(player1, player2);

        let ball = document.createElementNS(SVG_NS, 'circle');
        ball.setAttributeNS(null, 'r', this.radius);
        ball.setAttributeNS(null, 'cx', this.x);
        ball.setAttributeNS(null, 'cy', this.y);
        ball.setAttributeNS(null, 'fill', '#ff9900');

        svg.appendChild(ball);

        const rightGoal = this.x + this.radius >= this.boardWidth;
        const leftGoal = this.x - this.radius <= 0;

        if (rightGoal) {
            this.goal(player1);
            this.direction = 1;
            if (player1.score === 1) {
                // this.gameOver.play();
                alert(`
                    Final Score: ${player1.score} - ${player2.score}
                    Player 1 wins!
                    Click OK to Play Again`);
                this.gameOver.play();
                this.restart();
            }
            console.log('player1: ' + player1.score)
        } else if (leftGoal) {
            this.goal(player2);
            this.direction = -1;
            if (player2.score === 1) {
                // this.gameOver.play();
                alert(`
                    Final Score: ${player1.score} - ${player2.score}
                    Player 2 wins!
                    Click OK to Play Again`);
                this.restart();
            }
            console.log('player2: ' + player2.score)

        }
    }
}