export type TTileset = {
    tileSize: {
      x: number,
      y: number,
    },
    scale: number,
    tiles: {
        [key: string]: string;
    },
};