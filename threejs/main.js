import './style.css'

// Import three.js library
import * as THREE from 'three';

// Import orbital controls for mouse interactions
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

// Create a scene - container to hold objects, cameras, and lights
const scene = new THREE.Scene();

// Define a camera to look at objects in the scene
// Perspective camera mimics how a human eyeball would see objects
// Look at different camera types in three.js docs
// args = FOV, Aspect ratio, near plane boundary, far plane boundary
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Define a renderer that will render the graphics seen by the camera onto the scene
const renderer = new THREE.WebGLRenderer({
  // Where to render the scene - canvas element id = bg from html
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Move the camera from the middle of the scene to out towards you
camera.position.setZ(30);

// Render the scene as seen by the camera
renderer.render(scene, camera);

// Add an object to the scene
// Look at pre-built geometries in three js
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);

// Define a material for the geometry - think of this as wrapping paper for the shape
// Look at different materials available in three js
// Basic material does not need a light source, but other materials do

// const material = new THREE.MeshBasicMaterial({ color: 0xFF6347, wireframe: true});
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});

// Define a light source that will bounce off the material
// Point light emits light from all directions
const pointLight = new THREE.PointLight(0xffffff, 300);
pointLight.position.set(15,10,0);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers add context to the scene
// const pointLightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(pointLightHelper, gridHelper);

// Orbital controls
// const controls = new OrbitControls(camera, renderer.domElement);

// Add randomly generated objects to the scene - stars in our example
function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);

  // randomly generate x y and z coordinate
  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);

}

// Generate 200 stars
Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// Combine the geometry and the material to create the actual object
const torus = new THREE.Mesh(geometry, material);

// Add the object to the scene
scene.add(torus);

// Avatar
const vikTexture = new THREE.TextureLoader().load('vik.jpg');
const vik = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map: vikTexture})
);

scene.add(vik);

// Moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.png');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshBasicMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
);

scene.add(moon);

moon.position.z = -5;
moon.position.x = -15;
moon.position.setY(20);

vik.position.z = -5;
vik.position.x = 15;

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  vik.rotation.y += 0.05;
  vik.rotation.z += 0.01;

  camera.position.z = t * -0.2;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Create a recurssive infinite loop funct  ion to render automatically
function animate() {
  // Tells the browser to request animation frames from this function
  requestAnimationFrame( animate );

  // Create the animation by modifying object properties
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  // controls.update(); 
  renderer.render(scene, camera);
}

animate();