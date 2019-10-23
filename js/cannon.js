import './three.js';
import Bullet from './bullet.js';
import Barrel from './barrel.js';

export default class Cannon extends THREE.Object3D {
	constructor(x, y, z) {
		super();
		const loader = new THREE.TextureLoader();
		const texture = loader.load(
			'https://threejsfundamentals.org/threejs/lessons/resources/images/compressed-but-large-wood-texture.jpg'
		);
		this.material = new THREE.MeshBasicMaterial({
			map: texture,
		});
		this.rotateY(-Math.PI / 2);

		this.addBase(0, 1, 0);
		this.addBarrel(0, 4, 0);

		this.position.set(x, y, z);
	}

	addBase(x, y, z) {
		let geometry = new THREE.CubeGeometry(10, 2, 20);

		let base = new THREE.Mesh(geometry, this.material);

		let wheelGeo = new THREE.CylinderGeometry(5, 5, 2, 32);

		let lWheel = new THREE.Mesh(wheelGeo, this.material);
		lWheel.rotateZ(Math.PI / 2);
		let rWheel = lWheel.clone();

		base.add(lWheel);
		base.add(rWheel);

		lWheel.position.x = 5 + 1;
		rWheel.position.x = -(5 + 1);

		base.position.set(x, y, z);
		this.add(base);
	}

	addBarrel(x, y, z) {
		this.barrel = new Barrel(x, y, z);
		this.add(this.barrel);
	}

	rotateBarrel(value) {
		this.barrel.rotateY(value);
		this.barrel.totalRotation += value;
	}

	select() {
		this.barrel.changeColor(0xffffff);
	}

	unselect() {
		this.barrel.changeColor(0x808080);
	}

	createBullet() {
		let [position, rotation] = this.children[1].getEndPos();

		let speed = 300 + Math.random() * 20;
		let bullet = new Bullet(position.x, position.y, position.z, rotation);
		bullet.velocity
			.set(
				Math.sin(rotation - Math.PI / 2),
				0,
				Math.cos(rotation - Math.PI / 2)
			)
			.multiplyScalar(speed);

		return bullet;
	}
}
