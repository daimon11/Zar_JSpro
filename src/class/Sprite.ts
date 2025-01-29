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
  }
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
  }
  constructor({
    ctx,
    image,
    position,
    frames = {},
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

    console.log(frames, defaultFrames)

    this.frames = {...defaultFrames, ...frames};

    // console.log('this.frames', this.frames);

    console.log('this.frames.pixelGap', this.frames.pixelGap)
    this.width = (image.width - ((this.frames.col.max - 1) * this.frames.pixelGap)) / this.frames.col.max;
    this.height = (image.height - (this.frames.row.max - 1)) / this.frames.row.max;

    console.log('ctx', ctx)
  }

  draw() {
    const cropX = this.frames.col.val * this.width + this.frames.pixelGap;
    const cropY = this.frames.row.val * this.height + this.frames.pixelGap;

    console.log(cropX, cropY, this.image.width / this.frames.col.max,
      this.image.height / this.frames.row.max,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.col.max,
      this.image.height / this.frames.row.max)

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