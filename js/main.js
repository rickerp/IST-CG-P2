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
var friction = 70;
var rotationPerSpeed = 0.4; // 90 degrees per second
var followingCamera = false;

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

function toggleBulletAxes() {
	bullets.forEach(bullet => bullet.toggleAxes());
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
			followingCamera = false;
			break;
		case 50: // 2 perspective_camera
			camera = cameras[1];
			followingCamera = false;
			break;
		case 51: // 3 ball_camera
			if (bullets.length > 0) {
				// if a ball exists
				followingCamera = true;
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
		case 82: // r
			toggleBulletAxes();
			break;
	}
}

function render() {
	renderer.render(scene, camera);
}

function update(delta) {
	rotateSelectedCannon(sideRotation * delta);

	bullets.forEach(bullet => {
		bullet.speed = Math.max(0, bullet.speed - friction * delta);
		bullet.position.x += bullet.velocity.x * bullet.speed * delta;
		bullet.position.z += bullet.velocity.z * bullet.speed * delta;

		let perpendicular = new THREE.Vector3(
			bullet.velocity.z,
			bullet.velocity.y,
			-bullet.velocity.x
		);

		bullet.rotateOnAxis(
			perpendicular,
			rotationPerSpeed * bullet.speed * delta
		);
	});

	if (followingCamera) {
		let lastBullet = bullets[bullets.length - 1];
		let pos = lastBullet.position;
		let norm = lastBullet.velocity.clone().normalize();
		camera.position.set(
			pos.x - norm.x * 20,
			pos.y + 20,
			pos.z - norm.z * 20,
			2
		);
		camera.lookAt(pos);
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
