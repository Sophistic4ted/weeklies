import * as THREE from "https://cdn.skypack.dev/pin/three@v0.129.0-tccbvW7qPaDqcjcm1Rsy/mode=imports,min/optimized/three.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

let camera, scene, renderer, bulbLight, candleLight, candleLight2, lampLight;

let floorMat;

let previousShadowMap = false;

var flameMaterials = [];
var clock = new THREE.Clock();
var flame_time = 0;


main();
animate();

function main() {
  const canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer({canvas});
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.x = -4;
  camera.position.z = 4;
  camera.position.y = 2;

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  scene = new THREE.Scene();
  scene.background = new THREE.Color('black');

  {
    lampLight = new THREE.PointLight(0xffaa33, 2, 5, 2);

    lampLight.position.set(0, 0.3, 0);
    // lampLight.castShadow = true;
    // lampLight.shadow.camera.top = 200;
    // lampLight.shadow.camera.bottom = -200;
    // lampLight.shadow.camera.right = 200;
    // lampLight.shadow.camera.left = -200;
    // lampLight.shadow.mapSize.set(4096, 4096);
    scene.add(lampLight);
  }

  {
    candleLight = new THREE.PointLight(0xffaa33, .5, 5, 2);
    candleLight.position.set(0.361, 0.11, -0.281);
    candleLight.castShadow = true;
    // candleLight.shadow.camera.top = 200;
    // candleLight.shadow.camera.bottom = -200;
    // candleLight.shadow.camera.right = 200;
    // candleLight.shadow.camera.left = -200;
    // candleLight.shadow.mapSize.set(4096, 4096);
    scene.add(candleLight);
    candleLight2 = new THREE.PointLight(0xffaa33, .5, 10, 2);
    candleLight2.position.set(0.361, 0.11, -0.281);
    candleLight2.castShadow = true;
    // candleLight2.shadow.camera.top = 200;
    // candleLight2.shadow.camera.bottom = -200;
    // candleLight2.shadow.camera.right = 200;
    // candleLight2.shadow.camera.left = -200;
    // candleLight2.shadow.mapSize.set(4096, 4096);
    scene.add(candleLight2);
  }

  function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
    // compute a unit vector that points in the direction the camera is now
    // in the xz plane from the center of the box
    const direction = (new THREE.Vector3())
        .subVectors(camera.position, boxCenter)
        .multiply(new THREE.Vector3(1, 0, 1))
        .normalize();
  }

  {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('area.gltf', (gltf) => {
      const root = gltf.scene;
      scene.add(root);

      // compute the box that contains all the stuff
      // from root and below
      const box = new THREE.Box3().setFromObject(root);

      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());

      // set the camera to frame the box
      frameArea(boxSize * 0.5, boxSize, boxCenter, camera);

      // update the Trackball controls to handle the new size
      controls.maxDistance = boxSize * 10;
      controls.target.copy(boxCenter);
      controls.update();
    });
  }

  controls.minDistance = 1;
  controls.maxDistance = 6;
  controls.minPolarAngle = Math.PI / 5;
  controls.maxPolarAngle = Math.PI / 2 - 0.1;

  window.addEventListener("resize", onWindowResize);
}

function animate() {
  requestAnimationFrame(animate);

  render();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  // renderer.toneMappingExposure = Math.pow(params.exposure, 5.0); // to allow for very bright scenes.
  // renderer.shadowMap.enabled = params.shadows;
  // bulbLight.castShadow = params.shadows;

  // if (params.shadows !== previousShadowMap) {
  //   floorMat.needsUpdate = true;
  //   previousShadowMap = params.shadows;
  // }

  // bulbLight.power = bulbLuminousPowers[params.bulbPower];

  // //const time = Date.now() * 0.0005;

  // // bulbLight.position.x = Math.cos(time) * 0.75 + 1.25;
  // flame_time += clock.getDelta();
  // // flameMaterials[0].uniforms.time.value = flame_time;
  // // flameMaterials[1].uniforms.time.value = flame_time;
  // candleLight2.position.x = Math.sin(flame_time * Math.PI) * 0.02 + 0.361;
  // candleLight2.position.z = Math.cos(flame_time * Math.PI * 0.75) * 0.02 - 0.281;
  // candleLight2.intensity =
  //   4 + Math.sin(flame_time * Math.PI * 2) * Math.cos(flame_time * Math.PI * 1.5) * 0.25;

  renderer.render(scene, camera);
}