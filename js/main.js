import './three.js';
import Cannon from './Cannon.js';
import Bullet from './Bullet.js';
import Fence from './Fence.js';

export default class main {
	renderer = null;
	scene = null;
	
	keys = {};
	cameras = [];

	cannons = [];
	cannon = null;
	barrelRotationSpeed = 1.5;	
	sideRotation = 0;

	lastTimestamp = 0;

	constructor() {
		this.renderer = new THREE.WebGLRenderer({
			antialias: false,
		});

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);

		this.createScene();

		this.cameras[0] = this.createCamera(0, 100, 0, 0);
		this.cameras[1] = this.createCamera(70, 20, 0, 1);
		this.cameras[2] = this.createCamera(0, 0, 50, 1);
		this.camera = this.cameras[0];

		this.cannons[0] = this.createCannon(30, 0, -30);
		this.cannons[1] = this.createCannon(30, 0, 0);
		this.cannons[2] = this.createCannon(30, 0, 30);
		this.selectCannon(0);

		window.addEventListener('keydown', this.onKeyDown.bind(this));
		window.addEventListener('keyup', this.onKeyUp.bind(this));

		window.addEventListener('resize', this.onResize.bind(this));

		this.animate(this.lastTimestamp);
	}

	createScene() {
		this.scene = new THREE.Scene();
		this.scene.add(new THREE.AxisHelper(10));
	}

	createCamera(x, y, z, type) {
		if (type === 0) {
			var camera = new THREE.OrthographicCamera(
				window.innerWidth / -18,
				window.innerWidth / 18,
				window.innerHeight / 18,
				window.innerHeight / -18,
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
		camera.lookAt(this.scene.position);
		return camera;
	}

	createCannon(x, y, z) {
		let cannon = new Cannon(x, y, z);
		this.scene.add(cannon.object);
		return cannon;
	}

	selectCannon(n) {
		this.cannon = this.cannons[n];
		this.cannon.barrel.children[0].material.color.setHex(0xffffff);
	}

	rotateSelectedCannon(angle) {
		console.log(angle);
		this.cannon.rotateBarrel(angle);
	}

	onResize() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.camera.left = -window.innerWidth / 18;
		this.camera.right = window.innerWidth / 18;
		this.camera.top = window.innerHeight / 18;
		this.camera.bottom = -window.innerHeight / 18;
		this.camera.updateProjectionMatrix();
	}

	onKeyUp(e) {
		this.keys[e.keyCode] = false;
		switch (e.keyCode) {
			case 37:
				this.sideRotation = 0;
				break;
			case 39:
				this.sideRotation = 0;
				break;
		}	
	}

	onKeyDown(e) {
		this.keys[e.keyCode] = true;

		switch (e.keyCode) {
			case 49: // 1 upper_camera
				this.camera = this.cameras[0];
				break;
			case 50: // 2 perspective_camera
				this.camera = this.cameras[1];
				break;
			case 51: // 3 ball_camera
				this.camera = this.cameras[2];
				break;
			case 81: // q 
				this.selectCannon(0); 
				break;
			case 87: // w
				this.selectCannon(1);
				break;
			case 69: // e
				this.selectCannon(2);
				break;
			case 37: // left arrow
				this.sideRotation = this.barrelRotationSpeed;
				break;
			case 39: // right arrow
				this.sideRotation = -this.barrelRotationSpeed;
		}
	}

	setCameraPosition(x, y, z, n) {
		this.cameras[n].position.set(x, y, z);
		this.cameras[n].lookAt(this.scene.position);
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	update(delta) {
		this.rotateSelectedCannon(this.sideRotation * delta);
	}

	animate(ts) {
		let delta = (ts - this.lastTimestamp) / 1000;
		this.lastTimestamp = ts;

		this.update(delta);
		this.render();

		requestAnimationFrame(this.animate.bind(this));
	}
}

new main();