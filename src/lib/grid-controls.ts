import {
  EventDispatcher,
  Matrix4,
  Raycaster,
  Vector3,
  MOUSE,
  TOUCH
} from "three";

class GridControls extends EventDispatcher {
  constructor(object, domElement) {
    super();
    this.object = object;
    this.domElement = domElement;
    this.domElement.style.touchAction = 'none'; // disable touch scroll
    this.enabled = true;
    this.target = new Vector3(); // lookAt target
    
    this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" };
    this.mouseButtons = { LEFT: MOUSE.ROTATE, RIGHT: MOUSE.PAN };
    this.touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN };
    
    this.rotateSpeed = 1.0;
    this.zoomSpeed = 1.2;
    this.panSpeed = 1.0;
    this.enablePan = true;
    this.enableRotate = true;
    this.enableZoom = true;

    // for reset:
    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.zoom0 = this.object.zoom;

    this._domElementKeyEvents = null;
  }

  reset() {
    
  }
}

export { GridControls }