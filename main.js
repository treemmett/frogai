document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas');

  new GameController(canvas);
});

class GameController {
  playerPositionX = 4;
  gridX = 0;
  gridY = 0;
  obstacles = [];

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    // add 4-12 obstacles
    const numberOfObstacles = Math.floor(Math.random() * 8 + 4);
    console.log(numberOfObstacles);
    for (let i = 0; i < numberOfObstacles; i++) {
      this.obstacles.push({
        x: Math.floor(Math.random() * 10),
        y: Math.floor(Math.random() * 8)
      });
    }

    this.setup();

    window.addEventListener('resize', this.setup);
    window.addEventListener('keydown', this.handleInput);
  }

  setup = () => {
    cancelAnimationFrame(this.frameId);
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.gridW = this.canvas.width / 10;
    this.gridH = this.canvas.height / 10;
    this.render();
  };

  handleInput = e => {
    switch (e.key) {
      case 'w':
      case 'ArrowUp':
        // bring all obstacles down one level
        this.obstacles = this.obstacles
          .map(o => ({
            ...o,
            y: o.y + 1
          }))
          // remove past obstacles
          .filter(o => o.y < 10);

        // add between 0 and 3 obstacles to top row
        const num = Math.floor(Math.random() * 3);
        for (let i = 0; i < num; i++) {
          this.obstacles.push({
            y: 0,
            x: Math.floor(Math.random() * 10)
          });
        }
        break;

      case 'a':
      case 'ArrowLeft':
        if (this.playerPositionX === 0) {
          this.playerPositionX = 9;
        } else {
          this.playerPositionX--;
        }
        break;

      case 'd':
      case 'ArrowRight':
        if (this.playerPositionX === 9) {
          this.playerPositionX = 0;
        } else {
          this.playerPositionX++;
        }
        break;

      default:
        return;
    }

    this.render();
  };

  renderPlayer = () => {
    this.ctx.beginPath();
    this.ctx.fillStyle = 'green';
    this.ctx.rect(
      this.gridW * this.playerPositionX + 5,
      this.canvas.height - this.gridH * 2 + 5,
      this.gridW - 10,
      this.gridH - 10
    );
    this.ctx.fill();
  };

  renderGrid = () => {
    this.ctx.strokeStyle = 'black';
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        this.ctx.beginPath();
        this.ctx.rect(x * this.gridW, y * this.gridH, this.gridW, this.gridH);
        this.ctx.stroke();
      }
    }
  };

  renderObstacles = () => {
    this.obstacles.forEach(obstacle => {
      this.ctx.beginPath();
      this.ctx.fillStyle = 'brown';
      this.ctx.rect(
        this.gridW * obstacle.x + 5,
        this.gridH * obstacle.y + 5,
        this.gridW - 10,
        this.gridH - 10
      );
      this.ctx.fill();
    });
  };

  render = () => {
    // clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderGrid();

    // draw player
    this.renderPlayer();

    // draw all obstacles
    this.renderObstacles();
  };
}
