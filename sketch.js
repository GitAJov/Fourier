let x = [];
let y = [];
let fourierX;
let fourierY;
let time = 0;
let path = [];
let pauseStart = null;
let isPaused = false;
const pauseDuration = 10000; // 10 seconds in milliseconds

function setup() {
  createCanvas(1500, 1000);
  const skip = 8;
  for (let i = 0; i < drawing.length; i += skip) {
    x.push(drawing[i].x);
    y.push(drawing[i].y);
  }
  fourierX = dft(x);
  fourierY = dft(y);

  fourierX.sort((a, b) => b.amp - a.amp);
  fourierY.sort((a, b) => b.amp - a.amp);
}

function epiCycles(x, y, rotation, fourier, scale = 1) {
  for (let i = 0; i < fourier.length; i++) {
    let prevx = x;
    let prevy = y;
    let freq = fourier[i].freq;
    let radius = fourier[i].amp * scale; // Scale the radius
    let phase = fourier[i].phase;
    x += radius * cos(freq * time + phase + rotation);
    y += radius * sin(freq * time + phase + rotation);

    stroke(255, 100);
    noFill();
    ellipse(prevx, prevy, radius * 2); // Draw the circle with the scaled radius
    stroke(255);
    line(prevx, prevy, x, y);
  }
  return createVector(x, y);
}

function draw() {
  if (isPaused) {
    if (millis() - pauseStart >= pauseDuration) {
      // After 10 seconds, reset time and path
      isPaused = false;
      time = 0;
      path = [];
    } else {
      // Keep pausing (do nothing)
      return;
    }
  }
  background(0);

  let vx = epiCycles(400, 200, 0, fourierX, 0.5); // Smaller circle
  let vy = epiCycles(width-300, height/2, HALF_PI, fourierY, 0.5); // Smaller circle
  let v = createVector(vx.x, vy.y);

  path.unshift(v);
  line(vx.x, vx.y, v.x, v.y);
  line(vy.x, vy.y, v.x, v.y);

  beginShape();
  noFill();
  for (let i = 0; i < path.length; i++) {
    vertex(path[i].x, path[i].y);
  }
  endShape();

  const dt = TWO_PI / fourierY.length;
  time += dt;

  if (time > TWO_PI) {
    isPaused = true;
    pauseStart = millis();
  }
}
