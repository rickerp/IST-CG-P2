import './three.js';

export default class Barrel extends THREE.Object3D {
	constructor(x, y, z, options = {}) {
		super();
		this.position.set(x, y, z);
		this.material = new THREE.MeshStandardMaterial({
			color: 0x555555,
			metalness: 1,
			roughness: 0.6,
		});
		console.log(this.material);
		const height = options.height || 8;
		const lenght = options.lenght || 20 + height / 2;

		this.totalRotation = 0;
		this.addCylinder(
			0,
			0,
			(lenght - height / 2) / 2,
			height / 2 - 0.1,
			lenght - height / 2
		);
		this.addBack(0, 0, 0.2, height / 2);

		this.face = new THREE.Object3D();
		this.face.position.z = lenght - height / 2;
		this.face.add(new THREE.AxesHelper(10));
		this.add(this.face);
	}

	addCylinder(x, y, z, radius, height) {
		let geo = new THREE.CylinderGeometry(radius / 1.5, radius, height, 32);
		this.cylinder = new THREE.Mesh(geo, this.material);
		this.cylinder.rotateX(Math.PI / 2);
		this.cylinder.position.set(x, y, z);
		this.add(this.cylinder);
	}

	addBack(x, y, z, radius) {
		let geo = new THREE.SphereGeometry(
			radius,
			2 * radius,
			2 * radius,
			Math.PI,
			Math.PI
		);
		this.back = new THREE.Mesh(geo, this.material);
		this.back.position.set(x, y, z);
		this.add(this.back);
	}

	changeColor(colorHex) {
		this.cylinder.material.color.setHex(colorHex);
		this.back.material.color.setHex(colorHex);
	}

	getEndPos() {
		this.updateMatrixWorld();
		var vector = new THREE.Vector3();
		vector.setFromMatrixPosition(this.face.matrixWorld); // gets the position of the end cannon in world coordinates
		return [vector, this.totalRotation];
	}
}
