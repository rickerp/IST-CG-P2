import './three.js';

export default class Fence extends THREE.Object3D {
	constructor(x, y, z) {
		super();
		this.material = new THREE.MeshBasicMaterial({
			color: 0xff0000,
			wireframe: false,
		});

		this.addWall(0, 0, 0);
		this.addWall(48, 0, -50, Math.PI / 2);
		this.addWall(48, 0, 50, Math.PI / 2);

		this.position.set(x, y, z);
	}

	addWall(x, y, z, angle = 0) {
		let geometry = new THREE.CubeGeometry(4, 20, 100);
		let wall = new THREE.Mesh(geometry, this.material);
		wall.rotateY(angle);
		wall.position.set(x, y, z);
		this.add(wall);
	}
}
