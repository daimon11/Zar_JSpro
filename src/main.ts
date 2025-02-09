import './style.css';
import mapJSON from './assets/map.json';

import {SPRITES} from './const/const';

import {Sprite} from './class';

import calculateTileCoordinate from './utils/calculateTileCoordinate';
import loadSprites from './utils/loadSprites';
import createMap from './utils/createMap';

const canvas: HTMLCanvasElement | null = document.getElementById('game') as HTMLCanvasElement;

// https://rutube.ru/video/5607daca319b4a7cc69acd254e9e1f2f/?playlist=769125

if (!canvas) {
  console.error('Canvas element not found');
}
const MAP_COL_LENGTH = mapJSON.tilesets[0].columns;

const CANVAS_WIDTH: number = canvas.width;
const CANVAS_HEIGHT: number = canvas.height;
const COL_LENGTH = 30;
const ROW_LENGTH = 20;
const PLAYER_SIZE = 32;
const TILED_SIZE = 32;
const MAX_PLAYER_X = COL_LENGTH * TILED_SIZE;
const MAX_PLAYER_Y = ROW_LENGTH * TILED_SIZE;

let step = 0;
const shots = 9;

let keyPress = false;
let direction = 2;

let charaterX = 0;
let charaterY = 0;

const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

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

async function init() {
  const sprites = await loadSprites(SPRITES);

  const map = createMap({
    ctx,
    data: mapJSON.layers[0].data,
    image: sprites.MAP,
    mapColumns: COL_LENGTH,
    columns: 19,
    rows: 20,
    width: TILED_SIZE,
    height: TILED_SIZE,
    pixelGap: 0,
  })

  console.log('map', map);

  const terrian = new Sprite({
    ctx,
    image: sprites.MAP,
    position: {
      x: 0,
      y: 0,
    },
    frames: {
      col: {
        max: 19,
      },
      row: {
        max: 20,
      },
      pixelGap: 1,
    },
    tileNumber: 24,
  })

  const duratorMap = new Sprite({
    ctx,
    image: sprites.DUROTAR,
    position: {
      x: 0,
      y: 0,
    },
    frames: {
      col: {
        max: 1,
        val: 0,
      },
      row: {
        max: 1,
        val: 0,
      }
    }
  })

  const player = new Sprite({
    ctx,
    image: sprites.PLAYER,
    position: {
      x: 100,
      y: 100,
    },
    frames: {
      col: {
        max: 9,
        val: 6,
      },
      row: {
        max: 4,
        val: 3,
      }
    }
  })

  player.draw(),

    console.log('Start game Init');
  let lastTimeUpdate = 0;

  function animate(timestamp: number) {
    const deltaTime = timestamp - lastTimeUpdate;
    lastTimeUpdate = timestamp;
    window.requestAnimationFrame(animate)

    updateCamera();
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // map.forEach(sprite => {sprite.draw()})
    // map[96].draw();
    // drawGame();
    duratorMap.draw();
    // terrian.draw();
    // player.draw(),
    drawCharacter(deltaTime)
  }
  animate(lastTimeUpdate)

  function drawGame() {
    const {layers} = mapJSON;
    const {data} = layers[0];

    for (let ceil = 0; ceil < data.length; ceil++) {
      const col = ceil % COL_LENGTH;

      const row = Math.floor(ceil / COL_LENGTH);
      const tileNumber = data[ceil];

      const {x, y} = calculateTileCoordinate({
        tileNumber: tileNumber - 1,
        columns: MAP_COL_LENGTH,
        width: TILED_SIZE,
        height: TILED_SIZE,
        pixelGap: 1,
      })
      ctx.drawImage(
        sprites.MAP,
        x,
        y,
        TILED_SIZE,
        TILED_SIZE,
        col * TILED_SIZE - camera.x,
        row * TILED_SIZE - camera.y,
        TILED_SIZE,
        TILED_SIZE)
    }
  }

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
      sprites.PLAYER,
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
}

init();


//   ctx.drawImage(
//     terrianPathImg, //исходное изображение
//     (((371 % 19) * (32 + 1))), //координат по оси x исходного изображения
//     Math.floor(371 / 19) * (32 + 1), //координат по оси y исходного изображения
//     32, // Это ширина области, которую беру взять из исходного изображения
//     32, // Это высота области, которую беру взять из исходного изображения
//     0, //Это координаты (в пикселях) на канвасе по оси х, где надо отрисовать выбранный участок изображения
//     0, //Это координаты (в пикселях) на канвасе по оси у, где надо отрисовать выбранный участок изображения
//     64, // Это ширина, с которой нужно отрисовать выбранный участок изображения на канвасе.
//     64 // Это высота, с которой нужно отрисовать выбранный участок изображения на канвасе.
//   )
// }



