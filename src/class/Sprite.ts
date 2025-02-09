import calculateTileCoordinate from "../utils/calculateTileCoordinate";

interface SpriteProps {
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  position: {
    x: number,
    y: number,
  },
  frames?: {
    col: {
      max: number,
      val?: number,
    },
    row: {
      max: number,
      val?: number,
    },
    pixelGap?: number,
  },
  tileNumber?: number,
}

export class Sprite {
  private ctx: CanvasRenderingContext2D;
  image: HTMLImageElement;
  position: {
    x: number,
    y: number,
  }

  width: number;
  height: number;
  frames: {
    col: {
      max: number,
      val: number,
    },
    row: {
      max: number,
      val: number,
    },
    pixelGap?: number,
  };
  tileNumber?: number;

  constructor({
    ctx,
    image,
    position,
    frames = {},
    tileNumber,
  }: SpriteProps) {
    this.ctx = ctx;
    this.image = image;
    this.position = position;

    const defaultFrames = {
      col: {
        max: 1,
        val: 0,
      },
      row: {
        max: 1,
        val: 0,
      },
      pixelGap: 0
    };

    this.tileNumber = tileNumber;
    console.log('titleNumber', tileNumber);
    this.frames = {...defaultFrames, ...frames};

    const pixelGapCounter = this.frames.pixelGap !== 0 ? 1 : 0;

    this.width = (image.width - ((this.frames.col.max - pixelGapCounter) * this.frames.pixelGap)) / this.frames.col.max;
    this.height = (image.height - (this.frames.row.max - pixelGapCounter)) / this.frames.row.max;
  }

  draw() {
    let cropX = this.frames.col.val * this.width + this.frames.pixelGap;
    let cropY = this.frames.row.val * this.height + this.frames.pixelGap;

    if (this.tileNumber !== undefined) {
      const {x, y} = calculateTileCoordinate({
        tileNumber: this.tileNumber! - 1,
        width: this.frames.col.max,
        height: this.width,
        pixelGap: this.frames.pixelGap,
      });

      cropX = x;
      cropY = y;

    }
    this.ctx.drawImage(
      this.image,
      cropX,
      cropY,
      this.image.width / this.frames.col.max,
      this.image.height / this.frames.row.max,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.col.max,
      this.image.height / this.frames.row.max,
    )
  }
}