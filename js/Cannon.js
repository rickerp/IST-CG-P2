import Bullet from './Bullet.js';

export default class Cannon {
	object = null;
	barrel = null;
	shootingPos = null;

	constructor(x, y, z) {
		this.object = new THREE.Object3D();
		this.material = new THREE.MeshBasicMaterial({
			wireframe: false,
		});

		this.createBase(0, 1, 0);
		this.createBarrel(-7, 5, 0);

		this.shootingPos = new THREE.Object3D();
		this.shootingPos.position.set(-21, 5, 0);
		this.shootingPos.add(new THREE.AxesHelper(4));
		this.barrel.add(this.shootingPos);

		this.object.position.set(x, y, z);
	}

	createBase(x, y, z) {
		let geometry = new THREE.CubeGeometry(20, 2, 10);
		let material = new THREE.MeshBasicMaterial({
			wireframe: false,
			color: 0x993e14,
		});

		let mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y, z);

		this.object.add(mesh);
	}

	createBarrel(x, y, z) {
		let geometry = new THREE.CylinderGeometry(4, 4, 20, 32);
		let material = new THREE.MeshBasicMaterial({
			wireframe: false,
			color: 0x808080,
		});

		let mesh = new THREE.Mesh(geometry, material);
		this.barrel = new THREE.Object3D();
		mesh.rotateZ(Math.PI / 2);
		mesh.position.set(x, y, z);
		this.barrel.add(mesh);
		this.object.add(this.barrel);
	}

	rotateBarrel(value) {
		this.barrel.rotateY(value);
	}

	createBullet() {
		return new Bullet(
			this.shootingPos.position.x,
			this.shootingPos.position.y,
			this.shootingPos.position.z
		);
	}
}
