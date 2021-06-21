import * as THREE from "https://cdn.skypack.dev/pin/three@v0.129.0-tccbvW7qPaDqcjcm1Rsy/mode=imports,min/optimized/three.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

let camera, scene, renderer, bulbLight, hemiLight, candleLight, candleLight2, lampLight;

let ballMat, cubeMat, floorMat;

let previousShadowMap = false;

var flameMaterials = [];
var clock = new THREE.Clock();
var flame_time = 0;

function getFlameMaterial(isFrontSide) {
  let side = isFrontSide ? THREE.FrontSide : THREE.BackSide;
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
    },
    vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying float hValue;

        float random (in vec2 st) {
            return fract(sin(dot(st.xy,
                                 vec2(12.9898,78.233)))
                         * 43758.5453123);
        }


        float noise (in vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);

            // Four corners in 2D of a tile
            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));

            // Smooth Interpolation

            // Cubic Hermine Curve.  Same as SmoothStep()
            vec2 u = f*f*(3.0-2.0*f);
            // u = smoothstep(0.,1.,f);

            // Mix 4 coorners percentages
            return mix(a, b, u.x) +
                    (c - a)* u.y * (1.0 - u.x) +
                    (d - b) * u.x * u.y;
        }

        void main() {
          vUv = uv;
          vec3 pos = position;

          pos *= vec3(0.8, 2, 0.725);
          hValue = position.y;
          //float sinT = sin(time * 2.) * 0.5 + 0.5;
          float posXZlen = length(position.xz);

          pos.y *= 1. + (cos((posXZlen + 0.25) * 3.1415926) * 0.25 + noise(vec2(0, time)) * 0.125 + noise(vec2(position.x + time, position.z + time)) * 0.5) * position.y; // flame height

          pos.x += noise(vec2(time * 2., (position.y - time) * 4.0)) * hValue * 0.0312; // flame trembling
          pos.z += noise(vec2((position.y - time) * 4.0, time * 2.)) * hValue * 0.0312; // flame trembling

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
        }
      `,
    fragmentShader: `
        varying float hValue;
        varying vec2 vUv;

        vec3 heatmapGradient(float t) {
          return clamp((pow(t, 1.5) * 0.8 + 0.2) * vec3(smoothstep(0.0, 0.35, t) + t * 0.5, smoothstep(0.5, 1.0, t), max(1.0 - t * 1.7, t * 7.0 - 6.0)), 0.0, 1.0);
        }

        void main() {
          float v = abs(smoothstep(0.0, 0.4, hValue) - 1.);
          float alpha = (1. - v) * 0.99; // bottom transparency
          alpha -= 1. - smoothstep(1.0, 0.97, hValue); // tip transparency
          gl_FragColor = vec4(heatmapGradient(smoothstep(0.0, 0.3, hValue)) * vec3(0.95,0.95,0.4), alpha) ;
          gl_FragColor.rgb = mix(vec3(0,0,1), gl_FragColor.rgb, smoothstep(0.0, 0.3, hValue)); // blueish for bottom
          gl_FragColor.rgb += vec3(1, 0.9, 0.5) * (1.25 - vUv.y); // make the midst brighter
          gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.66, 0.32, 0.03), smoothstep(0.95, 1., hValue)); // tip
        }
      `,
    transparent: true,
    side: side,
  });
}

// ref for lumens: http://www.power-sure.com/lumens.htm
const bulbLuminousPowers = {
  "110000 lm (1000W)": 110000,
  "3500 lm (300W)": 3500,
  "1700 lm (100W)": 1700,
  "800 lm (60W)": 800,
  "400 lm (40W)": 400,
  "180 lm (25W)": 180,
  "20 lm (4W)": 20,
  Off: 0,
};

// ref for solar irradiances: https://en.wikipedia.org/wiki/Lux
const hemiLuminousIrradiances = {
  "0.0001 lx (Moonless Night)": 0.0001,
  "0.002 lx (Night Airglow)": 0.002,
  "0.5 lx (Full Moon)": 0.5,
  "3.4 lx (City Twilight)": 3.4,
  "50 lx (Living Room)": 50,
  "100 lx (Very Overcast)": 100,
  "350 lx (Office Room)": 350,
  "400 lx (Sunrise/Sunset)": 400,
  "1000 lx (Overcast)": 1000,
  "18000 lx (Daylight)": 18000,
  "50000 lx (Direct Sun)": 50000,
};

const params = {
  shadows: true,
  exposure: 0.68,
  bulbPower: Object.keys(bulbLuminousPowers)[4],
  hemiIrradiance: Object.keys(hemiLuminousIrradiances)[0],
};

init();
animate();

function init() {
  const container = document.getElementById("container");

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.x = -4;
  camera.position.z = 4;
  camera.position.y = 2;

  scene = new THREE.Scene();

  bulbLight = new THREE.PointLight(0xffaa33, 1, 5, 2);
  lampLight = new THREE.PointLight(0xffaa33, 2, 5, 2);

  lampLight.position.set(0, 0.3, 0);
  lampLight.castShadow = true;
  lampLight.shadow.camera.top = 200;
  lampLight.shadow.camera.bottom = -200;
  lampLight.shadow.camera.right = 200;
  lampLight.shadow.camera.left = -200;
  lampLight.shadow.mapSize.set(4096, 4096);
  scene.add(lampLight);
  hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);
  scene.add(hemiLight);



  candleLight = new THREE.PointLight(0xffaa33, .5, 5, 2);
  candleLight.position.set(0.361, 0.11, -0.281);
  candleLight.castShadow = true;
  candleLight.shadow.camera.top = 200;
  candleLight.shadow.camera.bottom = -200;
  candleLight.shadow.camera.right = 200;
  candleLight.shadow.camera.left = -200;
  candleLight.shadow.mapSize.set(4096, 4096);
  scene.add(candleLight);
  candleLight2 = new THREE.PointLight(0xffaa33, .5, 10, 2);
  candleLight2.position.set(0.361, 0.11, -0.281);
  candleLight2.castShadow = true;
  candleLight2.shadow.camera.top = 200;
  candleLight2.shadow.camera.bottom = -200;
  candleLight2.shadow.camera.right = 200;
  candleLight2.shadow.camera.left = -200;
  candleLight2.shadow.mapSize.set(4096, 4096);
  scene.add(candleLight2);
  //scene.add(new THREE.PointLightHelper(candleLight2));

  // // flame
  // function flame(isFrontSide) {
  //   let flameGeo = new THREE.SphereBufferGeometry(0.5, 32, 32);
  //   flameGeo.translate(0, 0.5, 0);
  //   let flameMat = getFlameMaterial(true);
  //   flameMaterials.push(flameMat);
  //   let flame = new THREE.Mesh(flameGeo, flameMat);
  //   flame.scale.set(.01,.01,.01);
  //   flame.position.set(0.361, 0.11, -0.281);
  //   flame.rotation.y = THREE.Math.degToRad(-45);
  //   scene.add(flame);
  // }

  // flame(false);
  // flame(true);

  floorMat = new THREE.MeshStandardMaterial({
    roughness: 0.8,
    color: 0xffffff,
    metalness: 0.2,
    bumpScale: 0.0005,
  });

  const gltfLoader = new GLTFLoader();
  gltfLoader.load("area.gltf", (gltf) => {
    gltf.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
      }
    });
    const root = gltf.scene;
    scene.add(root);
  });

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load("hardwood2_diffuse.jpg", function (map) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(10, 24);
    map.encoding = THREE.sRGBEncoding;
    floorMat.map = map;
    floorMat.needsUpdate = true;
  });
  textureLoader.load("hardwood2_bump.jpg", function (map) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(10, 24);
    floorMat.bumpMap = map;
    floorMat.needsUpdate = true;
  });
  textureLoader.load("hardwood2_roughness.jpg", function (map) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(10, 24);
    floorMat.roughnessMap = map;
    floorMat.needsUpdate = true;
  });

  const floorGeometry = new THREE.PlaneGeometry(20, 20);
  const floorMesh = new THREE.Mesh(floorGeometry, floorMat);
  floorMesh.receiveShadow = true;
  floorMesh.rotation.x = -Math.PI / 2.0;
  scene.add(floorMesh);


  renderer = new THREE.WebGLRenderer();
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  controls.minDistance = 1;
  controls.maxDistance = 6;
  controls.minPolarAngle = Math.PI / 5;
  controls.maxPolarAngle = Math.PI / 2 - 0.1;

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
  requestAnimationFrame(animate);

  render();
}


function render() {
  renderer.toneMappingExposure = Math.pow(params.exposure, 5.0); // to allow for very bright scenes.
  renderer.shadowMap.enabled = params.shadows;
  bulbLight.castShadow = params.shadows;

  if (params.shadows !== previousShadowMap) {
    floorMat.needsUpdate = true;
    previousShadowMap = params.shadows;
  }

  bulbLight.power = bulbLuminousPowers[params.bulbPower];

  hemiLight.intensity = hemiLuminousIrradiances[params.hemiIrradiance];
  //const time = Date.now() * 0.0005;

  // bulbLight.position.x = Math.cos(time) * 0.75 + 1.25;
  flame_time += clock.getDelta();
  // flameMaterials[0].uniforms.time.value = flame_time;
  // flameMaterials[1].uniforms.time.value = flame_time;
  candleLight2.position.x = Math.sin(flame_time * Math.PI) * 0.02 + 0.361;
  candleLight2.position.z = Math.cos(flame_time * Math.PI * 0.75) * 0.02 - 0.281;
  candleLight2.intensity =
    4 + Math.sin(flame_time * Math.PI * 2) * Math.cos(flame_time * Math.PI * 1.5) * 0.25;

  renderer.render(scene, camera);
}
