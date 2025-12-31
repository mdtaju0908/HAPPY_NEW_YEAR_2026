const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let particles = [];
let rockets = [];
let started = false;
let shake = 0;

const TRI = ["#FF9933", "#FFFFFF", "#138808"]; // INDIA 🇮🇳

class Rocket {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.target = Math.random() * canvas.height * 0.4;
    this.speed = 18 + Math.random() * 6;
  }

  update() {
    this.y -= this.speed;
    if (this.y <= this.target) {
      explode(this.x, this.y, Math.random() > 0.5);
      shake = 20;
      if (navigator.vibrate) navigator.vibrate(40);
      return true;
    }
    return false;
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, 3, 12);
  }
}

class Particle {
  constructor(x, y, color, depth) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.depth = depth; // 3D illusion
    this.angle = Math.random() * Math.PI * 2;
    this.speed = (Math.random() * 8 + 4) * depth;
    this.life = 150;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.life--;
  }

  draw() {
    ctx.globalAlpha = this.life / 150;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, 2 * this.depth, 2 * this.depth);
    ctx.globalAlpha = 1;
  }
}

function explode(x, y, tricolor = false) {
  const count = 500;
  for (let i = 0; i < count; i++) {
    const color = tricolor
      ? TRI[Math.floor(Math.random() * 3)]
      : `hsl(${Math.random() * 360},100%,50%)`;
    const depth = Math.random() * 1.5 + 0.5;
    particles.push(new Particle(x, y, color, depth));
  }
}

function animate() {
  ctx.save();

  if (shake > 0) {
    ctx.translate(
      Math.random() * shake - shake / 2,
      Math.random() * shake - shake / 2
    );
    shake *= 0.9;
  }

  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  rockets.forEach((r, i) => {
    if (r.update()) rockets.splice(i, 1);
    r.draw();
  });

  particles.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.life <= 0) particles.splice(i, 1);
  });

  ctx.restore();
  requestAnimationFrame(animate);
}

animate();

document.body.addEventListener("click", () => {
  if (started) return;
  started = true;

  document.getElementById("music").play();

  setInterval(() => rockets.push(new Rocket()), 120); // INSANE rockets
  setInterval(() => explode(
    Math.random() * canvas.width,
    Math.random() * canvas.height * 0.5,
    true
  ), 900); // tricolor bombs
});
