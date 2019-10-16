import './three.js';

export default class Fence extends THREE.Object3D {
	object = null;
	material = null;

	constructor(x, y, z) {
		super();
		this.material = new THREE.MeshBasicMaterial({
			color: 0x00ff00,
			wireframe: false,
		});

		this.position.set(x, y, z);
	}

	addWall(x, y, z) {
		let geometry = new THREE.CubeGeometry(10, 4, 20);
		let wall = new THREE.Mesh(geometry, this.material);
		wall.position.set(x, y, z);
		this.add(wall);
	}
}
