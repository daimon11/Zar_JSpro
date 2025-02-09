import {Sprite} from "../class";

interface createMapProps {
  ctx: CanvasRenderingContext2D,
  data: number[],
  image: HTMLImageElement,
  mapColumns: number,
  columns: number,
  rows: number,
  width: number,
  height: number,
  pixelGap: number,
};

export default function createMap({
  ctx,
  data,
  image,
  mapColumns,
  columns,
  rows,
  width,
  height,
  pixelGap}: createMapProps) {
  const result = [];

  for (let ceil = 0; ceil < data.length; ceil++) {
    const col = ceil % mapColumns;
    const row = Math.floor(ceil / mapColumns);
    const tileNumber = data[ceil];

    result.push(new Sprite({
      ctx,
      image,
      position: {
        x: col * width,
        y: row * height,
      },
      frames: {
        col: {
          max: columns,
        },
        row: {
          max: rows,
        },
        pixelGap: pixelGap,
      },
      tileNumber: tileNumber,
    }))
  }

  return result;
}