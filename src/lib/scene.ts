import { ACESFilmicToneMapping, DataTexture, EquirectangularReflectionMapping, PerspectiveCamera, Scene, Mesh, InstancedMesh, WebGLRenderer, Matrix4, DirectionalLight,
Vector3 } from "three";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import type { TMap, TTileset } from "../types";

type mapData = {
  [key: string]: Matrix4[],
};

class MainScene {
  constructor(canvas: HTMLCanvasElement) {
    this.camera = new PerspectiveCamera(75, document.documentElement.clientWidth / document.documentElement.clientHeight, 0.1, 1000);
    this.renderer = new WebGLRenderer({ 
      canvas, 
      precision: "lowp",
      antialias: false
    });
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;

    this.setupCamera();
    this.createLights();
  }

  async loadMap({ map, tileset}: { map: TMap, tileset: TTileset }) {
    this.clearMap();
    const parsedMap = this.parseMap(map, tileset);
    console.log(parsedMap);
    for (const [tile, transforms] of Object.entries(parsedMap)) {
      console.log(`load model: ${tile}: ${tileset.tiles[tile]}`);
      const gltf = await this.gltfLoader.loadAsync(tileset.tiles[tile]);
      const mesh = gltf.scene.children[0] as Mesh | undefined;
      const geo = mesh?.geometry.clone();
      const mat = mesh?.material;
      const instancedMesh = new InstancedMesh(geo, mat, transforms.length);
      transforms.forEach((transform, index) => {
        instancedMesh.setMatrixAt(index, transform);
      });
      instancedMesh.needsUpdate = true;
      this.scene.add(instancedMesh);
      this.tiles.push(instancedMesh);
      console.log(instancedMesh);
    }
  }

  private populateGeometry()

  private parseMap(map: TMap, tileset: TTileset) {
    let result: { [key: string]: Matrix4[] } = {};
    console.log(tileset);
    const { tileSize, scale } = tileset;    
    for (let y = 0; y < map.tiles.length; y++) {
      for (let x = 0; x < map.tiles[y].length; x++) {
        const char = map.tiles[y][x];
        const transform: Matrix4 = new Matrix4();
        transform.scale(new Vector3(scale, scale, scale));
        transform.setPosition(x * scale * tileSize.x, 0, y * scale * tileSize.y);        
        let name = "floor";
        switch (char) {
          case "#": {
            name = "wall";
            break;
          }
          case ".": 
          case "D": 
          case "L": 
          case "K": 
          case "T": 
          case "P": 
          case "B": {
            name = "floor";
            break;
          }
        }
        result[name] = result[name] ?? [];
        result[name].push(transform);
      }
    }
    return result;
  }

  private clearMap() {
    this.tiles.forEach(tile => {
      tile.removeFromParent();
      tile.dispose();
    });
    this.tiles = [];
  }
  
  async setEnvironment(path: string) {
    this.envMap = await this.rbgeLoader.loadAsync(path);
    this.envMap.mapping = EquirectangularReflectionMapping;
    this.scene.background = this.envMap;
    this.scene.environment = this.envMap;
  }

  private async init() {
    this.resize();
    this.render();
    //this.controls = new FirstPersonControls(this.camera, this.renderer.domElement);
    this.controls = new OrbitControls( this.camera, this.renderer.domElement);
    window.addEventListener('resize', () => this.resize());
  }

  private render() {
    window.requestAnimationFrame(() => this.render());
    this.renderer.render(this.scene, this.camera);
  }

  private resize() {
    this.renderer.setSize(
      document.documentElement.clientWidth, 
      document.documentElement.clientHeight);
    this.camera.aspect = document.documentElement.clientWidth / 
      document.documentElement.clientHeight;
    this.camera.updateProjectionMatrix();
  }

  private setupCamera() {
    this.camera = new PerspectiveCamera(75, document.documentElement.clientWidth / document.documentElement.clientHeight, 0.1, 1000);
    this.camera.position.z = -50;
    this.camera.position.y = 50;
  }

  private createLights() {
    const directionalLight = new DirectionalLight(0x9090aa);
    directionalLight.position.set(-10, 10, -10).normalize();
    this.scene.add(directionalLight);
  }

  private tiles: InstancedMesh[] = [];

  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  //private controls: FirstPersonControls | null = null;
  private controls: OrbitControls | null = null;
  private scene: Scene = new Scene();
  private gltfLoader: GLTFLoader = new GLTFLoader();
  private rbgeLoader: RGBELoader = new RGBELoader();
  private envMap: DataTexture | null = null;
};

export { MainScene };