import { Mesh, InstancedMesh, Matrix4, Vector3, Object3D, SkinnedMesh } from "three";
import type { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { TMapAsset, TTilesetAsset } from "../types";
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

type TMapData = {
  [key: string]: Matrix4[],
};

type TPosition = {
  transform: Matrix4,
  coords: { x: number, y: number },
};

const CharDict: { [key: string]: string} = {
  "#": "wall",
  ".": "floor",
  "D": "door",
  "L": "doorLocked",
  "K": "key",
  "T": "treasure",
  "@": "playerStart",
  "B": "boss",
};

class Map {
  constructor() {}

  async load(map: TMapAsset, tileset: TTilesetAsset, gltfLoader: GLTFLoader) {
    const { geometry, entities } = this.parseMap(map, tileset);
    await Promise.all([
      this.populateStaticGeometry(geometry, tileset, gltfLoader),
      this.populateEntities(entities, tileset, gltfLoader)
    ]);  
  }

  private async populateStaticGeometry(
    geometry: TMapData, 
    tileset:TTilesetAsset,
    gltfLoader: GLTFLoader
  ) {
    for (const [tile, transforms] of Object.entries(geometry)) {
      console.log(`load model: ${tile}: ${tileset.tiles[tile]}`);
      const gltf = await gltfLoader.loadAsync(tileset.tiles[tile]);
      const mesh = gltf.scene.children[0] as Mesh | undefined;
      const geo = mesh?.geometry.clone();
      const mat = mesh?.material;
      const instancedMesh: InstancedMesh = new InstancedMesh(geo, mat, transforms.length);
      instancedMesh.castShadow = true;
      instancedMesh.receiveShadow = true;
      transforms.forEach((transform, index) => {
        instancedMesh.setMatrixAt(index, transform);
      });
      instancedMesh.instanceMatrix.needsUpdate = true;
      this.tiles.push(instancedMesh);
    }
  }

  private async populateEntities(
    entities: TMapData, 
    tileset: TTilesetAsset,
    gltfLoader: GLTFLoader
  ) {
    for (const [entity, transforms] of Object.entries(entities)) {
      console.log(`load model: ${entity}: ${tileset.tiles[entity]}`);
      if (entity === "playerStart") {
        continue;
      }
      const gltf = await gltfLoader.loadAsync(tileset.tiles[entity]);
      gltf.scene.traverse(function(object: Object3D) {
        const mesh: Mesh = <Mesh>object;
        if (mesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });
      transforms.forEach(transform => {
        const model = SkeletonUtils.clone(gltf.scene);
        model.applyMatrix4(transform);
        model.updateMatrix();
        this.entities.push(model);
      })
    }
  }

  private parseMap(map: TMapAsset, tileset: TTilesetAsset) {
    let result: { geometry: TMapData, entities: TMapData } = { geometry: {}, entities: {} };
    console.log(tileset);
    const { tileSize, scale } = tileset;    
    for (let y = 0; y < map.tiles.length; y++) {
      for (let x = 0; x < map.tiles[y].length; x++) {
        const char = map.tiles[y][x];
        const transform: Matrix4 = new Matrix4();
        transform.scale(new Vector3(scale, scale, scale));
        transform.setPosition(x * scale * tileSize.x, 0, y * scale * tileSize.y);        
        let entityName = CharDict[char];
        let geometryName = char === "#" ? "wall" : "floor";
        
        result.geometry[geometryName] = result.geometry[geometryName] ?? [];
        result.geometry[geometryName].push(transform);
        if (entityName) {
          result.entities[entityName] = result.entities[entityName] ?? [];
          result.entities[entityName].push(transform);
        }
      }
    }
    return result;
  }

  private clearMap() {
    this.tiles.forEach(tile => {
      tile.removeFromParent;
      tile.dispose();
    });
    this.tiles = [];

    for (const entity of this.entities) {
      entity.removeFromParent;
      entity.traverse(function(child) {
        const skinnedMesh = <SkinnedMesh>child;
        if (skinnedMesh) skinnedMesh.skeleton.dispose();
      });
    }
    this.entities = [];
  }

  tiles: InstancedMesh[] = [];
  entities: Object3D[] = [];
  
}

export { Map, type TMapData, type TPosition, CharDict };
