import { ACESFilmicToneMapping, DataTexture, EquirectangularReflectionMapping, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";
import { GLTFLoader, type GLTF} from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

class MainScene {
  constructor(canvas: HTMLCanvasElement) {
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new WebGLRenderer({ antialias: true, canvas});
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;

    this.setupCamera();
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
    this.controls = new FirstPersonControls(this.camera, this.renderer.domElement);
    window.addEventListener('resize', () => this.resize());
  }

  private render() {
    window.requestAnimationFrame(() => this.render());
    this.renderer.render(this.scene, this.camera);
  }

  private resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  private setupCamera() {

  }

  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private controls: FirstPersonControls | null = null;
  private scene: Scene = new Scene();
  private gltfLoader: GLTFLoader = new GLTFLoader();
  private rbgeLoader: RGBELoader = new RGBELoader();
  private envMap: DataTexture | null = null;
}