import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import TWEEN from '@tweenjs/tween.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Define a renderer that will render the graphics seen by the camera onto the scene
const renderer = new THREE.WebGLRenderer({
  // Where to render the scene - canvas element id = bg from html
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Move the camera from the middle of the scene to out towards you
camera.position.setZ(0);
camera.position.setY(2);
camera.position.setX(-8);

// Render the scene as seen by the camera
renderer.render(scene, camera);

// Lights
const pointLight = new THREE.PointLight(0xffffff, 10);
pointLight.position.set(-2,4,0);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(0,1,0);

scene.add(directionalLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight);
// scene.add(pointLightHelper);

// Background
// const spaceTexture = new THREE.TextureLoader().load('background.jpg');
// scene.background = spaceTexture;

// Add a plane
// Grass texture
// const grassTexture = new THREE.TextureLoader().load('images/grass_texture_2.jpg');
// const grassTextureNormal = new THREE.TextureLoader().load('images/grass_texture_2_normal.jpg');
// // Set the texture to repeat
// grassTexture.wrapS = THREE.RepeatWrapping;
// grassTexture.wrapT = THREE.RepeatWrapping;

// // Control the number of repetitions
// grassTexture.repeat.set(8, 8); // Adjust these values as needed

// function addPlane() {
//   const geometry = new THREE.PlaneGeometry(200, 200, 20, 20);
//   const material = new THREE.MeshBasicMaterial({map: grassTexture,
//                                                 normalMap: grassTextureNormal
//   });

//   const plane = new THREE.Mesh(geometry, material);

//   plane.rotation.x = -Math.PI / 2; 
//   scene.add(plane);
// };

// addPlane();

// Add randomly generated objects to the scene - stars in our example
function getRandomCoordinate() {
  // Generates a random number between 100 and 200 or -100 and -200
  const range = 1000;
  const offset = 50;
  const sign = Math.random() < 0.5 ? -1 : 1;
  return sign * (Math.random() * range + offset);
}

function addStar(){
  const radius = (Math.random() * 1 + 1);
  const geometry = new THREE.SphereGeometry(radius, 24, 24);
  const material = new THREE.MeshBasicMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);

  // randomly generate x y and z coordinate
  const [x,y,z] = Array(3).fill().map(() => getRandomCoordinate());

  star.position.set(x, y, z);
  scene.add(star);

}

// Generate 200 stars
Array(2000).fill().forEach(addStar);

// Add comet animation to the scene
function createComet() {
  // Create comet geometry and material
  const geometry = new THREE.SphereGeometry(1, 24, 24);
  const material = new THREE.MeshBasicMaterial({ color: 0xffeb7a });
  const comet = new THREE.Mesh(geometry, material);

  // Set random initial position for the comet
  comet.position.set(getRandomCoordinate(), getRandomCoordinate(), getRandomCoordinate());

  // Add the comet to the scene
  scene.add(comet);

  // Animate the comet (simple example, adjust as needed for your scene)
  const tween = new TWEEN.Tween(comet.position)
      .to({ x: getRandomCoordinate(), y: getRandomCoordinate(), z: getRandomCoordinate(0) }, 2000)
      .onComplete(() => scene.remove(comet))
      .start();
}

// Orbital controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 2;
controls.maxDistance = 10;
controls.maxPolarAngle = Math.PI / 2;
controls.target.set( 0,1,0 );
controls.update();

const loader = new GLTFLoader();

loader.load( 'models/forest_house.glb', function ( gltf ) {

  const model = gltf.scene;
  model.scale.set(20,20,20);
  model.position.set(0,0,0);

  model.traverse(function (node) {
    if (node.isMesh){
      node.castShadow = true;
      node.recieveShadow = true;
    }
  });

	scene.add( model );

}, undefined, function ( error ) {

	console.error( error );

} );

// loader.load( 'models/painterly_cottage.glb', function ( gltf ) {

//   const model = gltf.scene;
//   model.scale.set(1,1,1);
//   model.position.set(0,0,0);

//   model.rotation.y = Math.PI/2;

//   model.traverse(function (node) {
//     if (node.isMesh){
//       node.castShadow = true;
//       node.recieveShadow = true;
//     }
//   });

// 	scene.add( model );

// }, undefined, function ( error ) {

// 	console.error( error );

// } );

let frameCount = 0;

// Create a recurssive infinite loop funct  ion to render automatically
function animate() {
  // Tells the browser to request animation frames from this function
  requestAnimationFrame( animate );

  frameCount++;
  if (frameCount%20 == 0){
    createComet();
  }
  TWEEN.update();

  controls.update(); 
  renderer.render(scene, camera);
}

animate();