document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas');

  new GameController(canvas);
});

class GameController {
  playerPositionX = 4;
  gridX = 0;
  gridY = 0;

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
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

  render = () => {
    // clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderGrid();

    // draw player
    this.renderPlayer();
  };
}
