import './style.css';
import mWalkPath from './assets/M-walk.png';
import terrianPath from './assets/durator.png';
import mapJSON from './assets/map.json';

import calculateTileCoordinate from './utils/calculateTileCoordinate';
import loadSprites from './utils/loadSprites';

const canvas: HTMLCanvasElement | null = document.getElementById('game') as HTMLCanvasElement;

console.log('есть', canvas);

if (!canvas) {
  console.error('Canvas element not found');
}

const CANVAS_WIDTH: number = canvas.width;
const CANVAS_HEIGHT: number = canvas.height;
const COL_LENGTH = 30;
const ROW_LENGTH = 20;
const PLAYER_SIZE = 32;
const TILED_SIZE = 32;
const MAX_PLAYER_X = COL_LENGTH * TILED_SIZE;
const MAX_PLAYER_Y = ROW_LENGTH * TILED_SIZE;

const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

const mapImg = new Image();
mapImg.src = terrianPath;
const charaterImg = new Image();
charaterImg.src = mWalkPath;
const camera = {
  x: 0,
  y: 0,
}

function updateCamera() {
  const halfWidth = CANVAS_WIDTH / 2;
  const halfHeigth = CANVAS_HEIGHT / 2;

  camera.x = Math.max(0, Math.min(charaterX - halfWidth, MAX_PLAYER_X - halfWidth))
  camera.y = Math.max(0, Math.min(charaterY - halfHeigth, MAX_PLAYER_Y - halfHeigth))

  if (camera.x >= MAX_PLAYER_X - CANVAS_WIDTH) {
    camera.x = MAX_PLAYER_X - CANVAS_WIDTH;
  }
  if (camera.y >= MAX_PLAYER_Y - CANVAS_HEIGHT) {
    camera.y = MAX_PLAYER_Y - CANVAS_HEIGHT;
  }
}

// loadSprites(mWalkPath, terrianPath).then(() => {
//   console.log('Start game Init');
//   let lastTimeUpdate = 0;

//   function animate(timestamp: number) {
//     const deltaTime = timestamp - lastTimeUpdate;

//     updateCamera();
//     ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
//     // drawGame();
//     drawCharacter(deltaTime)

//     lastTimeUpdate = timestamp;
//     window.requestAnimationFrame(animate);
//   }
//   window.requestAnimationFrame(animate)
// })

function drawGame() {
  const { layers } = mapJSON;
  const { data } = layers[0];

  // console.log('data', data.length);

  // for (let ceil = 0; ceil < data.length; ceil++) {
  // const col = ceil % COL_LENGTH;

  // console.log('col', col);
  //   const row = Math.floor(ceil / COL_LENGTH);
  //   const tileNumber = data[ceil];

  // console.log(col, row, tileNumber)
  // const { x, y } = calculateTileCoordinate({
  //   tileNumber: tileNumber - 1,
  //   columns: COL_LENGTH,
  //   width: TILED_SIZE,
  //   height: TILED_SIZE,
  //   pixelGap: 1,
  // })
  // ctx.drawImage(
  //   mapImg,
  //   x,
  //   y,
  //   TILED_SIZE,
  //   TILED_SIZE,
  //   col * TILED_SIZE - camera.x,
  //   row * TILED_SIZE - camera.y,
  //   TILED_SIZE,
  //   TILED_SIZE)
  // }

  // ctx.drawImage(
  //   mapImg,
  //   0,
  //   224,
  //   TILED_SIZE,
  //   TILED_SIZE,
  //   0,
  //   0,
  //   TILED_SIZE,
  //   TILED_SIZE)
}

let step = 0;
const shots = 9;

let keyPress = false;
let direction = 2;

let charaterX = 0;
let charaterY = 0;

function drawCharacter(deltaTime: number) {
  if (keyPress) {
    step = (step + 0.015 * deltaTime) % shots;
    const speed = Math.floor(deltaTime * 0.15)

    if (direction === 0) {
      charaterX += speed;
    }
    if (direction === 1) {
      charaterX -= speed;
    }
    if (direction === 2) {
      charaterY += speed;
    }
    if (direction === 3) {
      charaterY -= speed;
    }

    if (charaterX < 0) {
      charaterX = 0
    } else if (charaterX > MAX_PLAYER_X - PLAYER_SIZE) {
      charaterX = MAX_PLAYER_X - PLAYER_SIZE
    }

    if (charaterY < 0) {
      charaterY = 0
    } else if (charaterY > MAX_PLAYER_Y - PLAYER_SIZE) {
      charaterY = MAX_PLAYER_Y - PLAYER_SIZE
    }
  }

  ctx.drawImage(
    charaterImg,
    145 * Math.floor(step),
    160 * direction,
    145,
    160,
    charaterX - camera.x,
    charaterY - camera.y,
    PLAYER_SIZE,
    PLAYER_SIZE)
}


function keyDownHandler(event: KeyboardEvent) {
  preventScroll(event)
  switch (event.key) {
    case 'ArrowRight':
    case "Right":
      keyPress = true;
      direction = 0;
      break;
    case 'ArrowLeft':
    case "Left":
      keyPress = true;
      direction = 1;
      break;
    case 'ArrowDown':
    case "Down":
      keyPress = true;
      direction = 2;
      break;
    case 'ArrowUp':
    case "Up":
      keyPress = true;
      direction = 3;
      break;
  }
}

function keyUpHandler(event: KeyboardEvent) {
  console.log(event.key);
  keyPress = false;
  direction = 2;
  step = 0;
}

function preventScroll(event: Event) {
  event.preventDefault();
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

const { layers } = mapJSON;
const { data } = layers[0];

const terrianPathImg = new Image();
terrianPathImg.src = terrianPath;

terrianPathImg.onload = function () {

  console.log('terrianPathImg', terrianPathImg);

  for (let ceil = 0; ceil < data.length; ceil++) {
    const col = ceil % COL_LENGTH;
    const row = Math.floor(ceil / COL_LENGTH)

    const tileNumber = data[ceil];
    console.log(tileNumber)
    console.log('col', col, 'row', row)
    const { x, y } = calculateFoo({
      tileNumber: tileNumber - 1,
      col: col,
    })
    ctx.drawImage(terrianPathImg, x, y, 32, 32, col * 32, row * 32, 32, 32)
    // ctx.drawImage(terrianPathImg, col * 32, row * 32, 32, 32, col * 32, row * 32, 32, 32)
  }


}


function calculateFoo({
  col = 16,
  width = 32,
  height = 32,
  tileNumber = 0,
}) {
  console.log('col', col, 'tileNumber', tileNumber);

  const x = (tileNumber % col) * width;
  const y = Math.floor(tileNumber / col) * height;
  console.log('x', x, 'y', y);

  return { x, y };
}

