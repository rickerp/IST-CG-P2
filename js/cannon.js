import './three.js';
import Bullet from './bullet.js';
import Barrel from './barrel.js';

export default class Cannon extends THREE.Object3D {
	constructor(x, y, z) {
		super();
		this.material = new THREE.MeshBasicMaterial({ wireframe: false });
		this.rotateY(-Math.PI / 2);

		this.addBase(0, 1, 0);
		this.addBarrel(0, 4, 0);

		this.position.set(x, y, z);
	}

	addBase(x, y, z) {
		let geometry = new THREE.CubeGeometry(10, 2, 20);
		let material = new THREE.MeshBasicMaterial({
			wireframe: false,
			color: 0x993e14,
		});
		let base = new THREE.Mesh(geometry, material);

		base.position.set(x, y, z);
		this.add(base);
	}

	addBarrel(x, y, z) {
		this.barrel = new Barrel(x, y, z);
		this.add(this.barrel);
	}

	rotateBarrel(value) {
		this.barrel.rotateY(value);
	}

	select() {
		this.barrel.changeColor(0xffffff);
	}

	unselect() {
		this.barrel.changeColor(0x808080);
	}

	createBullet() {
		return new Bullet(
			this.shootingPos.position.x,
			this.shootingPos.position.y,
			this.shootingPos.position.z
		);
	}
}
