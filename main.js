import './style.css'

const global = {
  keys: [],
  loop: undefined,
  canvas: document.querySelector("#app").appendChild(
    document.createElement("canvas") // make the canvas and put it on the website
  ),
};
global.ctx = global.canvas.getContext("2d");

// constantly updating keys
document.addEventListener("keydown", ({ key }) => {
  if (global.keys.indexOf(key) != -1) return;
  global.keys.push(key);
});
document.addEventListener("keyup", ({ key }) => {
  const index = global.keys.indexOf(key);
  if (index == -1) return;
  global.keys.splice(index, 1);
});

// newer javascript stuff
[global.canvas.width, global.canvas.height] = [800, 600];

// code for the square
class MySquare {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
    this.color = color;

    this.velocityX = 0;
    this.velocityY = 0;
    this.gravity = 600;
    this.drag = 0.99;
  }

  draw() {
    global.ctx.save(); // search up `ctx.save()` and `ctx.restore()` on w3schools
    global.ctx.fillStyle = this.color;
    global.ctx.fillRect(this.x, this.y, this.w, this.h);
    global.ctx.restore();
  }

  update(dt) {
    // wrap around the screen in the x-direction
    if (this.x > global.canvas.width) this.x = 0 - this.w;
    else if (this.x < 0 - this.w) this.x = global.canvas.width;

    // use velocities and use dt
    this.x += this.velocityX * dt;
    this.y += this.velocityY * dt;

    // velocities diminish over time
    this.velocityX *= this.drag;
    this.velocityY *= this.drag;

    // make the square collide with the floor
    if (this.y + this.h == global.canvas.height + 1) {
      // we are touching the floor, don't run the stuff below
    } else if (this.y + this.h > global.canvas.height) {
      // implant the square into the floor so it doesn't experience gravity
      this.y = global.canvas.height - this.h + 1;
      this.velocityY = 0;
    } else {
      // the square is mid-air and gravity exists
      // positive y direction is downwards
      // 0,0 is at the top left
      this.velocityY += this.gravity * dt;
    }
  }

  jump() {
    // the square must be on the floor to jump
    if (this.y + this.h < global.canvas.height) return;

    // negative y direction is upwards
    this.velocityY = -500;

    // unimplant the square from the floor
    this.y = global.canvas.height - this.h - 1;
  }
}

// make the square
const mySquare = new MySquare(0, 0, 50, 50, "#FF0000");

const gameLoop = (before) => (now) => {
  const dt = (now - before) / 1000; // change in time
  // by default times are handled in milliseconds so
  // dt is divided by 1000

  // clear the screen
  global.ctx.clearRect(0, 0, global.canvas.width, global.canvas.height);

  // draw & update our square
  mySquare.draw();
  mySquare.update(dt);

  // move the square when keys are pressed
  if (global.keys.indexOf("ArrowLeft") != -1) mySquare.velocityX -= 10;
  if (global.keys.indexOf("ArrowRight") != -1) mySquare.velocityX += 10;
  if (global.keys.indexOf("ArrowUp") != -1) mySquare.jump();
  if (global.keys.indexOf("ArrowDown") != -1) mySquare.velocityY += 50;
  
  // example of how to stop the loop
  if (global.keys.indexOf("q") != -1) {
    // clear the screen
    global.ctx.clearRect(0, 0, global.canvas.width, global.canvas.height);

    cancelAnimationFrame(global.loop);
    return;
    // return early so the code below this doesn't
    // run and keep the loop going
  }

  // keep the loop going
  global.loop = requestAnimationFrame(
    gameLoop(now)
  );
};

// this runs when the window loads
window.onload = () => {
  // start game loop
  global.loop = requestAnimationFrame(
    gameLoop(performance.now())
  );
};
