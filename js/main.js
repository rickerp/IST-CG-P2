import './three.js';
import Cannon from './cannon.js';
import Bullet from './bullet.js';
import Fence from './fence.js';
import { randomInt } from './util.js';

var renderer = null;
var scene = null;
var keys = {};
var lastTimestamp = 0;
var light = null;

var cameras = [];
var cannons = [];
var camera = null;
var cannon = null;

var fence = null;
var axes = true;

var bullets = [];
var friction = 200;
var rotationPerSpeed = 0.4; // 90 degrees per second
var followingCamera = false;

var barrelRotationSpeed = 1.5;
var sideRotation = 0;
var shooted = false;

function init() {
	renderer = new THREE.WebGLRenderer({
		antialias: true,
	});

	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	createScene();

	cameras[0] = createCamera(0, 100, 0, 0);
	cameras[1] = createCamera(130, 20, 0, 1);
	cameras[2] = createCamera(0, 0, 50, 1);

	camera = cameras[0];

	light.position.set(camera.position.x, camera.position.y, camera.position.z);

	updateCameras();

	cannons[0] = createCannon(80, 0, -30);
	cannons[1] = createCannon(80, 0, 0);
	cannons[2] = createCannon(80, 0, 30);
	selectCannon(0);

	fence = createFence(-70, 10, 0);
	createBulletField(10, 9, 9);

	createBase(-22, -2, 0);

	window.addEventListener('keydown', onKeyDown);
	window.addEventListener('keyup', onKeyUp);
	window.addEventListener('resize', onResize);

	animate(lastTimestamp);
}

function createBase(x, y, z) {
	let geometry = new THREE.CubeGeometry(100, 4, 104);
	let material = new THREE.MeshBasicMaterial({
		wireframe: false,
		color: 0xa4a4a4,
	});
	let base = new THREE.Mesh(geometry, material);

	base.position.set(x, y, z);
	scene.add(base);
}

function addBullet(bullet) {
	bullet.axes.visible = axes;
	bullets.push(bullet);
	scene.add(bullet);
}

function createBulletField(blockSize, width, length) {
	const origin = new THREE.Vector3(-60, 4, -40);

	const numberOfBlocks = width * length;
	// 10 to 30% filled
	const numberOfBullets = randomInt(
		0.1 * numberOfBlocks,
		0.3 * numberOfBlocks
	);
	let visited = {};

	let i = 0;
	while (i < numberOfBullets) {
		let n = randomInt(0, numberOfBlocks);
		if (visited[n]) continue;
		visited[n] = true;

		let x = Math.floor(n / width) * blockSize;
		let y = (n % width) * blockSize;

		let bullet = new Bullet(x, 0, y);
		bullet.position.add(origin);
		addBullet(bullet);
		i++;
	}
}

function createScene() {
	scene = new THREE.Scene();
	light = new THREE.SpotLight(0xffffff, 3);
	light.target.position.set(0, 0, 0);

	scene.add(light.target);
	scene.add(light);
	scene.add(new THREE.AxisHelper(10));
}

function updateCameras() {
	// Update ortographic camera
	const min_width = 100 * 2;
	const min_height = 100;

	// Calculate new possible values of width and height
	let height = (window.innerHeight / window.innerWidth) * min_height;
	let width = (window.innerWidth / window.innerHeight) * min_width;

	// Height doesn't fit the screen
	if (height < min_height) {
		// Lock height
		height = min_height;
		// Adjust width
		width = (window.innerWidth / window.innerHeight) * height;
	}

	// Width doesn't fit the screen
	if (width < min_width) {
		// Lock width
		width = min_width;
		// Adjust height
		height = (window.innerHeight / window.innerWidth) * width;
	}

	Object.assign(cameras[0], {
		left: -width / 2,
		right: width / 2,
		top: height / 2,
		bottom: -height / 2,
	});

	// Update perspective camera

	const new_ar = window.innerWidth / window.innerHeight;
	cameras[1].aspect = cameras[2].aspect = new_ar;

	cameras.forEach(camera => camera.updateProjectionMatrix());
}

function createCamera(x, y, z, type) {
	let camera;
	if (type === 0) {
		camera = new THREE.OrthographicCamera();
		camera.near = -200;
		camera.far = 500;
	} else if (type === 1) {
		camera = new THREE.PerspectiveCamera();
		camera.fov = 70;
		camera.near = 1;
		camera.far = 1000;
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

function shootBullet() {
	let bullet = cannon.createBullet();
	addBullet(bullet);
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
	updateCameras();
}

function toggleBulletAxes() {
	axes = !axes;
	bullets.forEach(bullet => (bullet.axes.visible = axes));
}

function onKeyUp(e) {
	keys[e.keyCode] = false;
	shooted = false;
}

function onKeyDown(e) {
	keys[e.keyCode] = true;

	switch (e.keyCode) {
		case 49: // 1 upper_camera
			camera = cameras[0];
			light.position.set(
				camera.position.x,
				camera.position.y,
				camera.position.z
			);
			break;
		case 50: // 2 perspective_camera
			camera = cameras[1];
			light.position.set(
				camera.position.x,
				camera.position.y,
				camera.position.z
			);
			break;
		case 51: // 3 ball_camera
			if (bullets.length > 0) {
				// if a ball exists
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
		case 82: // r
			toggleBulletAxes();
			break;
	}
}

function render() {
	renderer.render(scene, camera);
}

function handleCollisions(delta) {
	// Find all ball-wall collisions
	for (let bullet of bullets) {
		// Create AABB
		let x = bullet.position.x - bullet.radius;
		let z = bullet.position.z - bullet.radius;
		let size = bullet.radius * 2;

		// Ignore bullets out of the fence
		if (bullet.gone) {
			continue;
		}

		// Check if it's out of the fence
		if (x + size > 40) {
			// And out of canion area
			if (z < -48 || z > 54) {
				bullet.gone = true;
				bullet.velocity.y = -50;
			}
			continue;
		}

		// Left wall
		if (x < -68) {
			bullet.position.x = -68 + bullet.radius;
			bullet.velocity.x *= -1;
		}

		// Top wall
		if (z < -48 && z + size > -44) {
			bullet.position.z = -48 + bullet.radius;
			bullet.velocity.z *= -1;
		}

		// Bottom wall
		if (z + size > 48 && z + size < 54) {
			bullet.position.z = 48 - bullet.radius;
			bullet.velocity.z *= -1;
		}
	}
	// Find all bullet pairs
	for (let i = 0; i < bullets.length; ++i) {
		// prettier-ignore
		// ^ allows inline method chaining
		for (let j = i + 1; j < bullets.length; ++j) {
			let b1 = bullets[i];
			let b2 = bullets[j];

			let distance = b1.position.distanceTo(b2.position);

			// No collision
			if (distance > b1.radius + b2.radius) {
				continue;
			}

			// https://en.wikipedia.org/wiki/Elastic_collision

			let x1 = b1.position.clone();
			let x2 = b2.position.clone();
			let v1 = b1.velocity.clone();
			let v2 = b2.velocity.clone();

			// If positions are same, give tiny separation to solve collision
			if (x1.equals(x2)) {
				x1.addScalar(1e-10);
			}

			let a = v1.clone().sub(v2).dot(x1.clone().sub(x2));
			let b = x1.clone().sub(x2).length() ** 2;
			let c = x1.clone().sub(x2).multiplyScalar(-a/b);

			b1.velocity.add(c);
			b1.velocity.y = 0;

			a = v2.clone().sub(v1).dot(x2.clone().sub(x1));
			b = x2.clone().sub(x1).length() ** 2;
			c = x2.clone().sub(x1).multiplyScalar(-a/b);

			b2.velocity.add(c);
			b2.velocity.y = 0;

			let dir = b1.position.clone().sub(b2.position).normalize();
			let diff = (b1.radius + b2.radius) - distance;

			// Let's solve collision
			b1.position.add(dir.clone().multiplyScalar(diff / 2));
			b2.position.sub(dir.clone().multiplyScalar(diff / 2));
		}
	}
}

function update(delta) {
	let sideRotation = 0;

	if (keys[37]) sideRotation += barrelRotationSpeed; // left arrow
	if (keys[39]) sideRotation -= barrelRotationSpeed; // right arrow
	if (keys[32] && !shooted) {
		shooted = true;
		shootBullet();
	}
	handleCollisions(delta);
	rotateSelectedCannon(sideRotation * delta);

	bullets.forEach(bullet => {
		// Calculate instant velocity
		let speed = bullet.velocity.length();
		// Get normalized direction
		let direction = bullet.velocity.clone().normalize();
		// Decrease speed with friction and calculate new velocity
		speed = Math.max(0, speed - friction * delta);
		bullet.velocity.x = direction.x * speed;
		bullet.velocity.z = direction.z * speed;

		bullet.position.x += bullet.velocity.x * delta;
		bullet.position.y += bullet.velocity.y * delta;
		bullet.position.z += bullet.velocity.z * delta;

		let perpendicular = new THREE.Vector3(
			bullet.velocity.z,
			bullet.velocity.y,
			-bullet.velocity.x
		);

		if (speed > 0) {
			bullet.rotateOnAxis(
				perpendicular.normalize(),
				rotationPerSpeed * speed * delta
			);
		}
	});

	if (camera == cameras[2]) {
		let lastBullet = bullets[bullets.length - 1];
		let pos = lastBullet.position;
		camera.position.set(pos.x + 50, pos.y + 50, pos.z);
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
