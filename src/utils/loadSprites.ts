type imagesPath = Record<string, string>;

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img)
    })
}

export default function loadSprites(spritesPath: imagesPath): Promise<HTMLImageElement[]> {
    console.log('spritesPath', spritesPath);

    return Promise
        .all(Object.values(spritesPath).map(loadImage))
        .then((sprites) => Object.fromEntries(
            Object.keys(spritesPath).map((key, index) => [key, sprites[index]])
        )) as Promise<Record<string, HTMLElement>>
}
