import './three.js';
import Bullet from './Bullet.js';
('use strict');

export default class Cannon extends THREE.Object3D {
	barrel = null;
	cannonEnd = null;

	constructor(x, y, z) {
		super();
		this.material = new THREE.MeshBasicMaterial({ wireframe: false });

		this.addBase(0, 1, 0);
		this.addBarrel(-7, 5, 0);

		this.cannonEnd = new THREE.Object3D();
		this.cannonEnd.add(new THREE.AxesHelper(10));
		this.cannonEnd.position.set(0, 10, 0);

		this.barrel.add(this.cannonEnd);
		this.position.set(x, y, z);
	}

	addBase(x, y, z) {
		let geometry = new THREE.CubeGeometry(20, 2, 10);
		let material = new THREE.MeshBasicMaterial({
			wireframe: false,
			color: 0x993e14,
		});
		let base = new THREE.Mesh(geometry, material);

		base.position.set(x, y, z);
		this.add(base);
	}

	addBarrel(x, y, z) {
		let geometry = new THREE.CylinderGeometry(4, 4, 20, 32);
		let material = new THREE.MeshBasicMaterial({
			wireframe: false,
			color: 0x808080,
		});
		this.barrel = new THREE.Mesh(geometry, material);
		this.barrel.rotateZ(Math.PI / 2);
		this.barrel.position.set(x, y, z);
		this.add(this.barrel);
	}

	rotateBarrel(value) {
		this.barrel.rotateX(value);
	}

	changeColor(colorHex) {
		this.barrel.material.color.setHex(colorHex);
	}

	createBullet() {
		return new Bullet(
			this.shootingPos.position.x,
			this.shootingPos.position.y,
			this.shootingPos.position.z
		);
	}
}
