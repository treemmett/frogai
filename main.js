document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas');

  new GameController(canvas);
});

class GameController {
  score = 0;
  playerPositionX = 4;
  gridX = 0;
  gridY = 0;
  obstacles = [];

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    // load sprites
    this.tree = new Image();
    this.tree.src = './sprites/tree.png';
    this.tree.onload = this.render;

    this.frog = new Image();
    this.frog.src = './sprites/frog.png';
    this.frog.onload = this.render;

    this.water = new Image();
    this.water.src = './sprites/water.png';
    this.water.onload = this.render;

    // add 4-12 obstacles
    const numberOfObstacles = Math.floor(Math.random() * 8 + 4);
    for (let i = 0; i < numberOfObstacles; i++) {
      this.addObstacle();
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
        // increase score
        this.score++;

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
          this.addObstacle(true);
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

  addObstacle = newRow => {
    // create a map of obstacles to see if the created on overlaps any
    const map = new Array(10)
      .fill()
      .map(() => new Array(10).fill().map(() => false));

    for (let i = 0; i < this.obstacles.length; i++) {
      const o = this.obstacles[i];

      map[o.y][o.x] = true;

      // set map for all width coordinates
      for (let j = 0; j < o.width; j++) {
        map[o.y][o.x + j] = true;
      }
    }

    const createdObstacle = {
      x: Math.floor(Math.random() * 11 - 1),
      y: newRow ? 0 : Math.floor(Math.random() * 8),
      width: Math.floor(Math.random() * 4) || 1
    };

    // check if any part of the obstacle collides with another
    for (let i = 0; i < createdObstacle.width; i++) {
      if (map[createdObstacle.y][createdObstacle.x + i]) {
        return;
      }
    }

    this.obstacles.push(createdObstacle);
  };

  renderPlayer = () => {
    this.ctx.drawImage(
      this.frog,
      this.gridW * this.playerPositionX + 5,
      this.canvas.height - this.gridH * 2 + 5,
      this.gridW - 10,
      this.gridH - 10
    );
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
      if (obstacle.width === 1) {
        this.ctx.drawImage(
          this.tree,
          this.gridW * obstacle.x + 5,
          this.gridH * obstacle.y + 5,
          this.gridW * obstacle.width - 10,
          this.gridH - 10
        );
      } else {
        this.ctx.drawImage(
          this.water,
          this.gridW * obstacle.x + 5,
          this.gridH * obstacle.y + 5,
          this.gridW * obstacle.width - 10,
          this.gridH - 10
        );
      }
    });
  };

  render = () => {
    // clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#6fb52b';
    this.ctx.fill();

    // draw player
    this.renderPlayer();

    // draw all obstacles
    this.renderObstacles();

    this.ctx.fillStyle = 'black';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(this.score, this.canvas.width - 50, 30);
  };
}
