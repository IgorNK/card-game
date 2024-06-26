export type TTilesetAsset = {
    tileSize: {
      x: number,
      y: number,
      z: number,
    },
    scale: number,
    tiles: {
        [key: string]: string;
    },
};