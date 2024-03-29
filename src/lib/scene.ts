import { ACESFilmicToneMapping, DataTexture, EquirectangularReflectionMapping, PerspectiveCamera, Scene, Mesh, InstancedMesh, WebGLRenderer, Matrix4, DirectionalLight, SphereGeometry, MeshBasicMaterial, Group, 
Vector3 } from "three";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { Direction, Node, Graph, shortestPath } from "./navigation";
import { Map, type TMapData, type TPosition, CharDict } from "./map";

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
  }

  async loadMap({ mapAsset, tileset}: { mapAsset: TMapAsset, tileset: TTilesetAsset }) {
    this.nodeGraph = this.buildNodeGraph(mapAsset, tileset);
    this.createNodeSpheres(this.nodeGraph);   
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

  private buildNodeGraph(
    map: TMapAsset, 
    tileset: TTilesetAsset
  ): Graph<TNode> {
    const transformMap: Array<Array<Node<Matrix4> | null>> = [];
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
            if (transformMap[y2] && transformMap[y2][x2]) {
              graph.addEdge(node, transformMap[y2][x2], direction);
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
    this.envMap = await this.rbgeLoader.loadAsync(path);
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
    console.log('setup camera');
    this.camera = new PerspectiveCamera(75, document.documentElement.clientWidth / document.documentElement.clientHeight, 0.1, 1000);
    
    // this.controls = new OrbitControls( this.camera, this.renderer.domElement);
    this.controls = new FirstPersonControls(this.camera, this.renderer.domElement);
    // this.cameraRig.add(this.camera);
    const playerNode = this.nodeGraph.nodes.find(node => node.value.entity === 'playerStart');
    const playerPos = new Vector3().setFromMatrixPosition(playerNode.value.position.transform);
    const targetNode = playerNode.neighbours[Direction.front];
    const targetPos = new Vector3().setFromMatrixPosition(targetNode.value.position.transform);
    console.log(playerPos);
    console.log(targetPos);
    const cameraMatrix = new Matrix4().setPosition(playerPos);
    this.camera.applyMatrix4(cameraMatrix);
    this.camera.updateMatrix();
    this.camera.lookAt(targetPos);
    // this.camera.position.z = -50;
    // this.camera.position.y = 50;
  }

  private createLights() {
    const directionalLight = new DirectionalLight(0x9090aa);
    directionalLight.position.set(-10, 10, -10).normalize();
    this.scene.add(directionalLight);
  }

  private nodeGraph: Graph<TNode> | null = null;

  private cameraRig: Group = new Group();
  private camera: PerspectiveCamera | null;
  private renderer: WebGLRenderer;
  //private controls: FirstPersonControls | null = null;
  private controls: OrbitControls | null = null;
  private scene: Scene = new Scene();
  private gltfLoader: GLTFLoader = new GLTFLoader();
  private rbgeLoader: RGBELoader = new RGBELoader();
  private envMap: DataTexture | null = null;
};

export { MainScene };