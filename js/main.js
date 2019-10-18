import './three.js';
import Cannon from './cannon.js';
import Bullet from './bullet.js';
import Fence from './fence.js';

var renderer = null;
var scene = null;
var keys = {};
var lastTimestamp = 0;

var cameras = [];
var cannons = [];
var camera = null;
var cannon = null;

var fence = null;

var bullets = [];
var friction = 0.9; //applied to balls that have collided
var following_camera = false;

var barrelRotationSpeed = 1.5;
var sideRotation = 0;

function init() {
	renderer = new THREE.WebGLRenderer({
		antialias: false,
	});

	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	createScene();

	cameras[0] = createCamera(0, 100, 0, 0);
	cameras[1] = createCamera(130, 20, 0, 1);
	cameras[2] = createCamera(0, 0, 50, 1);
	camera = cameras[0];

	cannons[0] = createCannon(80, 0, -30);
	cannons[1] = createCannon(80, 0, 0);
	cannons[2] = createCannon(80, 0, 30);
	selectCannon(0);

	fence = createFence(-70, 10, 0);

	window.addEventListener('keydown', onKeyDown);
	window.addEventListener('keyup', onKeyUp);
	window.addEventListener('resize', onResize);

	animate(lastTimestamp);
}

function createScene() {
	scene = new THREE.Scene();
	scene.add(new THREE.AxisHelper(10));
}

function createCamera(x, y, z, type) {
	if (type === 0) {
		var camera = new THREE.OrthographicCamera(
			window.innerWidth / -12,
			window.innerWidth / 12,
			window.innerHeight / 12,
			window.innerHeight / -12,
			-200,
			500
		);
	} else if (type === 1) {
		var camera = new THREE.PerspectiveCamera(
			70,
			window.innerWidth / window.innerHeight,
			1,
			1000
		);
	}

	camera.position.set(x, y, z);
	camera.lookAt(scene.position);
	return camera;
}

function createCannon(x, y, z) {
	let cannon = new Cannon(x, y, z);
	scene.add(cannon);
	return cannon;
}

function createBullet() {
	let bullet = cannon.createBullet();
	bullets.push(bullet);
	scene.add(bullet);
}

function createFence(x, y, z) {
	let fence = new Fence(x, y, z);
	scene.add(fence);
	return fence;
}

function selectCannon(n) {
	!cannon ? {} : cannon.unselect();
	cannon = cannons[n];
	cannon.select();
}

function rotateSelectedCannon(angle) {
	cannon.rotateBarrel(angle);
}

function onResize() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.left = -window.innerWidth / 18;
	camera.right = window.innerWidth / 18;
	camera.top = window.innerHeight / 18;
	camera.bottom = -window.innerHeight / 18;
	camera.updateProjectionMatrix();
}

function onKeyUp(e) {
	keys[e.keyCode] = false;
	switch (e.keyCode) {
		case 37:
			sideRotation = 0;
			break;
		case 39:
			sideRotation = 0;
			break;
	}
}

function onKeyDown(e) {
	keys[e.keyCode] = true;

	switch (e.keyCode) {
		case 49: // 1 upper_camera
			camera = cameras[0];
			following_camera = false;
			break;
		case 50: // 2 perspective_camera
			camera = cameras[1];
			following_camera = false;
			break;
		case 51: // 3 ball_camera
			if (bullets.length > 0) {
				// if a ball exists
				following_camera = true;
				camera = cameras[2];
			}
			break;
		case 81: // q
			selectCannon(2);
			break;
		case 87: // w
			selectCannon(1);
			break;
		case 69: // e
			selectCannon(0);
			break;
		case 37: // left arrow
			sideRotation = barrelRotationSpeed;
			break;
		case 39: // right arrow
			sideRotation = -barrelRotationSpeed;
			break;
		case 32: // space
			createBullet();
			break;
	}
}

function setCameraPosition(x, y, z, n) {
	cameras[n].position.set(x, y, z);
	cameras[n].lookAt(scene.position);
}

function render() {
	renderer.render(scene, camera);
}

function update(delta) {
	rotateSelectedCannon(sideRotation * delta);

	for (let i = 0; i < bullets.length; i++) {
		bullets[i].position.x += bullets[i].velocity.x * bullets[i].speed;
		bullets[i].position.z += bullets[i].velocity.z * bullets[i].speed;
		bullets[i].rotateOnAxis(bullets[i].velocity, delta * bullets[i].speed); //TODO: rotate along bullet movement
		bullets[i].speed -= bullets[i].speed * friction * delta;
	}
	if (following_camera == true) {
		let vec = bullets[bullets.length - 1].position;
		setCameraPosition(vec.x, vec.y, vec.z, 2);
		camera.lookAt(scene.position); //  TODO: should be aiming at the bullet a little bit behind her
	}
}

function animate(ts) {
	let delta = (ts - lastTimestamp) / 1000;
	lastTimestamp = ts;

	update(delta);
	render();

	requestAnimationFrame(animate);
}

init();
