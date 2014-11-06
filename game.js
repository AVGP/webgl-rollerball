Physijs.scripts.worker = 'lib/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var scene = new Physijs.Scene();
scene.setGravity(new THREE.Vector3( 0, -50, 0 ));
scene.addEventListener('update', function() {
  scene.simulate(undefined, 2);
});

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

light = new THREE.DirectionalLight(0xffffff);

light.position.set(0, 100, 60);
light.castShadow = true;
light.shadowCameraLeft = -60;
light.shadowCameraTop = -60;
light.shadowCameraRight = 60;
light.shadowCameraBottom = 60;
light.shadowCameraNear = 1;
light.shadowCameraFar = 1000;
light.shadowBias = -.0001
light.shadowMapWidth = light.shadowMapHeight = 1024;
light.shadowDarkness = .7;

scene.add(light);

var geometry = new THREE.CubeGeometry(1, 1, 1);
var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.set(0,5,20);

var grounds = [],
    groundGeometry = new THREE.CubeGeometry(10, 1, 10, 10, 10),
    groundMaterial = Physijs.createMaterial(
      new THREE.MeshLambertMaterial({ color: 0xeeeeee }),
      0.4, // restitution ("bounciness")
      0.8  // friction
    );

for(var z=0;z<10;z++) {
  grounds[z] = [];
  for(var x=0;x<10;x++) {
    var ground = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
    ground.position.y = -3;
    ground.position.x = (x - 5) * 10;
    ground.position.z = (z - 5) * 10;
    scene.add(ground);
    grounds[z][x] = ground;
  }
}

var ball = new Physijs.SphereMesh(new THREE.SphereGeometry(3, 16, 16),
  Physijs.createMaterial(
    new THREE.MeshLambertMaterial({color: 0xff0000, reflectivity: .8}),
    0.4, // restitution ("bounciness")
    0.6  // friction
  ),
  1
);

ball.position.y = 1.5;
ball.add(camera);
scene.add(ball);
var baseGamma = undefined;
window.addEventListener("deviceorientation", function(e) {
  if(baseGamma === undefined) baseGamma = e.gamma;

  var dz = (e.gamma - baseGamma) / 90,
      ry = e.beta / 180;
  ball.translateZ(-dz);
  ball.rotation.y -= ry;
  ball.__dirtyPosition = true;
  ball.__dirtyRotation = true;
});


function updateGame() {
	requestAnimationFrame(updateGame);
	renderer.render(scene, camera);
}

updateGame();
scene.simulate();
