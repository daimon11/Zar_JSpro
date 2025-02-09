interface CalculateTileCoordinateParams {
    tileNumber?: number;
    columns?: number;
    width?: number;
    height?: number;
    pixelGap?: number;
}

interface TileCoordinate {
    x: number;
    y: number;
}

export default function calculateTileCoordinate({
    tileNumber = 0,
    columns = 19,
    width = 32,
    height = 32,
    pixelGap = 0,
}: CalculateTileCoordinateParams): TileCoordinate {
    console.log('pixelGap', pixelGap);

    const x = (tileNumber % columns) * (width + pixelGap);
    const y = Math.floor(tileNumber / columns) * (height + pixelGap);
    return {x, y};
}