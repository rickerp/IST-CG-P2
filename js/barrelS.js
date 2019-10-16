import './three.js';

export default class Barrel extends THREE.Object3D {
	constructor(x, y, z, options = {}) {
		super();
		this.position.set(x, y, z);
		this.material = new THREE.MeshBasicMaterial({
			wireframe: false,
			color: 0x808080,
		});
		const height = options.height || 8;
		const lenght = options.lenght || 20 + height / 2;

		this.addCylinder(
			0,
			0,
			(lenght - height / 2) / 2,
			height / 2,
			lenght - height / 2
		);
		this.addBack(0, 0, 0, height / 2);

		this.face = new THREE.Object3D();
		this.face.position.z = lenght - height / 2;
		this.face.add(new THREE.AxesHelper(10));
		this.add(this.face);
	}

	addCylinder(x, y, z, radius, height) {
		let geo = new THREE.CylinderGeometry(radius, radius, height, 32);
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
		this.add(this.back);
	}

	changeColor(colorHex) {
		this.cylinder.material.color.setHex(colorHex);
		this.back.material.color.setHex(colorHex);
	}

	getEndPos() {
		return this.face.position;
	}
}
