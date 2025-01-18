function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img)
    })
}

export default function loadSprites(...imagePath: string[]): Promise<HTMLImageElement[]> {
    console.log(imagePath);

    return Promise.all(imagePath.map(loadImage));
}
