import { 
  ACESFilmicToneMapping, 
  DataTexture, 
  EquirectangularReflectionMapping, 
  PerspectiveCamera, 
  Scene, 
  Mesh, 
  InstancedMesh, 
  WebGLRenderer, 
  Matrix4, 
  DirectionalLight, 
  SphereGeometry, 
  MeshBasicMaterial, 
  Group, 
  Vector3, 
  MathUtils, 
  Quaternion
} from "three";
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { Direction, Node, Graph, shortestPath, cw, ccw, opposite, strToDirection } from "./navigation";
import { Map, type TMapData, type TPosition, CharDict } from "./map";
import type { TMapAsset, TTilesetAsset, TInputCallbacks } from "../types";
import * as TWEEN from "@tweenjs/tween.js";
import {  } from "three";
import { base } from '$app/paths';

type TNode = {
  position: TPosition,
  entity: string,
};

function getTopLeftNeighbours(coords: {x: number, y: number}) {
  const { x, y } = coords;
  const neighbours = [];
    neighbours.push({direction: Direction.left, coords: { x: x - 1, y }});
    neighbours.push({direction: Direction.front, coords: { x, y: y - 1 }});
  return neighbours;
}

class MainScene {
  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({ 
      canvas, 
      precision: "lowp",
      antialias: false
    });
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.createLights();
    this.init();
  }

  async loadMap({ mapAsset, tileset}: { mapAsset: TMapAsset, tileset: TTilesetAsset }) {
    this.nodeGraph = this.buildNodeGraph(mapAsset, tileset);
    //this.createNodeSpheres(this.nodeGraph);   
    this.setupCamera();
    const map = new Map();
    await map.load(mapAsset, tileset, this.gltfLoader);
    map.tiles.forEach(tile => {
      this.scene.add(tile);
    });
    map.entities.forEach(entity => {
      this.scene.add(entity);
    });     
  }

  registerControls(): TInputCallbacks {
    let callbacks: TInputCallbacks = {
      onLeft: () => {
        this.cameraDirection = ccw(this.cameraDirection);
        this.rotateCamera(this.cameraDirection);
      },
      onRight: () => {
        this.cameraDirection = cw(this.cameraDirection);
        this.rotateCamera(this.cameraDirection);
      },
      onUp: () => {
        if (!this.controlsEnabled) {
          return;
        }
        const node = this.cameraNode?.neighbours[this.cameraDirection];        
        if (node !== undefined) {  
          if (node !== null) {
            this.cameraNode = node;
          }        
          this.moveCamera(node);
        }        
      },
      onDown: () => {
        this.cameraDirection = opposite(this.cameraDirection);
        this.rotateCamera(this.cameraDirection);
      }
    };
    return callbacks;
  }

  private buildNodeGraph(
    map: TMapAsset, 
    tileset: TTilesetAsset
  ): Graph<TNode> {
    const transformMap: Array<Array<Node<TNode> | null>> = [];
    const graph = new Graph<TNode>();
    const { tileSize, scale } = tileset;
    for (let y = 0; y < map.tiles.length; y++) {
      transformMap.push([]);
      for (let x = 0; x < map.tiles[y].length; x++) {
        const coords = { x, y };
        const char = map.tiles[y][x];
        const transform: Matrix4 = new Matrix4();
        transform.setPosition(
          (x * tileSize.x) * scale, 
          tileSize.y / 2 * scale, 
          (y * tileSize.z) * scale,
        );
        if (char !== "#") {
          const node = graph.addNode({
            position: { transform, coords },
            entity: CharDict[char]
          });
          transformMap[y].push(node);
          const neighbours = getTopLeftNeighbours(coords);
          neighbours.forEach(neighbour => {
            const { direction, coords: { x: x2, y: y2 }} = neighbour;
            const targetNode = transformMap[y2][x2];
            if (targetNode) {
              graph.addEdge(node, targetNode, direction);
            }
          })
        } else {
          transformMap[y].push(null);
        }
      }
    }
    return graph;
  }

  private createNodeSpheres(graph: Graph<TNode>) {
    graph.forEach(node => {
      const sphere = new Mesh(
        new SphereGeometry(1, 8, 8),
        new MeshBasicMaterial({ color: 0xffff00 })
      );
      const { position: { transform, coords: { x, y } }, entity } = node.value;
      sphere.applyMatrix4(transform);
      this.scene.add(sphere);
      for (const [direction, neighbour] of Object.entries(node.neighbours)) {
        const sphere = new Mesh(
          new SphereGeometry(0.5, 8, 8),
          new MeshBasicMaterial({ color: 0x00ffff })
        );
        const origin = new Vector3().setFromMatrixPosition(transform);
        let sphereTransform = new Matrix4();
        switch (direction) {
          case Direction.left: {
            sphereTransform.setPosition(origin.x - 5, origin.y, origin.z);
            break;
          }
          case Direction.front: {
            sphereTransform.setPosition(origin.x, origin.y, origin.z - 5);
            break;
          }
          case Direction.back: {
            sphereTransform.setPosition(origin.x, origin.y, origin.z + 5);
            break;
          }
          case Direction.right: {
            sphereTransform.setPosition(origin.x + 5, origin.y, origin.z);
            break;
          }
        }
        sphere.applyMatrix4(sphereTransform);
        this.scene.add(sphere);
      }
    });
  }
  
  async setEnvironment(path: string) {
    this.envMap = await this.rbgeLoader.loadAsync(`${base}/` + path);
    this.envMap.mapping = EquirectangularReflectionMapping;
    this.scene.background = this.envMap;
    this.scene.environment = this.envMap;
  }

  private async init() {
    this.resize();
    this.render();
    //this.controls = new FirstPersonControls(this.camera, this.renderer.domElement);
    window.addEventListener('resize', () => this.resize());
  }

  private render() {
    window.requestAnimationFrame(() => this.render());
    if (this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
    TWEEN.update();
  }

  private resize() {
    this.renderer.setSize(
      document.documentElement.clientWidth, 
      document.documentElement.clientHeight
    );
    if (this.camera) {
      this.camera.aspect = document.documentElement.clientWidth / 
        document.documentElement.clientHeight;
      this.camera.updateProjectionMatrix();
    }    
  }

  private setupCamera() {
    this.camera = new PerspectiveCamera(75, document.documentElement.clientWidth / document.documentElement.clientHeight, 0.1, 1000);
    
    // this.controls = new OrbitControls( this.camera, this.renderer.domElement);
    // this.cameraRig.add(this.camera);
    const playerNode = this.nodeGraph?.nodes.find(node => node.value.entity === 'playerStart');
    if (!playerNode) {
      console.error("EXCEPTION: player node not found in node graph");
      return;
    }
    const playerPos = new Vector3().setFromMatrixPosition(playerNode.value.position.transform);
    this.cameraNode = playerNode;
    let targetNode: Node<TNode> | null = null;
    for (const [direction, neighbour] of Object.entries(playerNode.neighbours)) {
      if (neighbour) {
        targetNode = neighbour;
        this.cameraDirection = strToDirection(direction) || Direction.front;
        break;
      }
    }
    if (!targetNode) {
      console.error("EXCEPTION: player start doesn't have any neighbouring nodes");
      return;
    }

    const targetPos = new Vector3().setFromMatrixPosition(targetNode.value.position.transform);
    const cameraMatrix = new Matrix4().setPosition(playerPos);
    this.camera.applyMatrix4(cameraMatrix);
    this.camera.updateMatrix();
    this.camera.lookAt(targetPos);
  }

  private async rotateCamera(dir: Direction) {
    if (!this.camera) {
      return;
    }
    let newRotation;
    switch (dir) {
      case (Direction.left): {
        newRotation = 90;
        break;
      }
      case (Direction.right): {
        newRotation = -90;
        break;
      }
      case (Direction.front): {
        newRotation = 0;
        break;
      }
      case (Direction.back): {
        newRotation = 180;
        break;
      }
    }
    let to = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), MathUtils.degToRad(newRotation));
    let factor = {t: 0};
    const cameraTween = new TWEEN.Tween(factor).to({t: 1}, this.rotateMs).onUpdate(() => {
      if (this.camera) {
        this.camera.quaternion.slerp(to, factor.t);
      }
    }).start();
  }

  private async moveCamera(node: Node<TNode> | null) {
    if (!this.camera) {
      return;
    }
    if (node === null) {
      this.bumpCamera();
      return;
    }
    
    const from = new Vector3().setFromMatrixPosition(this.camera.matrix);
    const to = new Vector3().setFromMatrixPosition(node.value.position.transform);
    let factor = {t: 0};
    const cameraTween = new TWEEN.Tween(factor).to({t: 1}, this.moveMs).onUpdate(() => {
      if (this.camera) {
        const current = new Vector3().lerpVectors(from, to, factor.t);
        this.camera.position.copy(current);
      }
    })
    .onStart(() => {
      this.controlsEnabled = false;
    })
    .onComplete(() => {
      this.controlsEnabled = true;
    })
    .start();
  }

  private async bumpCamera() {
    if (!this.camera) {
      return;
    }
    const from = new Vector3().setFromMatrixPosition(this.camera.matrix);
    let direction = new Vector3();
    this.camera.getWorldDirection(direction);
    const to = from.clone().add(direction.multiplyScalar(this.bumpLength));
    let factor = {t: 0};
    const cameraTweenA = new TWEEN.Tween(factor).to({t: 1}, this.bumpMs).onUpdate(() => {
      if (this.camera) {
        const current = new Vector3().lerpVectors(from, to, factor.t);
        this.camera.position.copy(current);
      }
    }).onStart(() => {
      this.controlsEnabled = false;
    });
    const cameraTweenB = new TWEEN.Tween(factor).to({t: 1}, this.bumpMs).onUpdate(() => {
      if (this.camera) {
        const current = new Vector3().lerpVectors(to, from, factor.t);
        this.camera.position.copy(current);
      }
    }).onComplete(() => {
      this.controlsEnabled = true;
    });
    cameraTweenA.chain(cameraTweenB);
    cameraTweenA.start();
  }

  private createLights() {
    const directionalLight = new DirectionalLight(0x9090aa);
    directionalLight.position.set(-10, 10, -10).normalize();
    this.scene.add(directionalLight);
  }

  private nodeGraph: Graph<TNode> | null = null;

  controlsEnabled = true;
  private camera: PerspectiveCamera | null = null;
  private cameraDirection: Direction = Direction.front;
  private cameraNode: Node<TNode> | null = null;
  private rotateMs = 300;
  private moveMs = 300;
  private bumpMs = 100;
  private bumpLength = 2;
  private renderer: WebGLRenderer;
  // private controls: OrbitControls | null = null;
  private scene: Scene = new Scene();
  private gltfLoader: GLTFLoader = new GLTFLoader();
  private rbgeLoader: RGBELoader = new RGBELoader();
  private envMap: DataTexture | null = null;
};

export { MainScene };