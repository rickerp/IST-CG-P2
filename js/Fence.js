import './three.js';
('use strict');

export default class Fence extends THREE.Object3D {
	material = null;

	constructor(x, y, z) {
		super();
		this.material = new THREE.MeshBasicMaterial({
			color: 0xff0000,
			wireframe: false,
		});

		this.addWall(0, 0, 0);
		this.addWall(0, 0, 0);
		this.addWall(0, 0, 0);
		this.moveWalls();

		this.position.set(x, y + 10, z);
	}

	addWall(x, y, z) {
		let geometry = new THREE.CubeGeometry(100, 4, 20);
		let wall = new THREE.Mesh(geometry, this.material);
		wall.position.set(x, y, z);
		this.add(wall);
	}

	moveWalls() {
		this.children[0].rotateX(Math.PI / 2); // puts the wall vertical
		this.children[0].rotateZ(Math.PI / 2); // puts the back wall perpendicular to the others
		this.children[1].rotateX(Math.PI / 2);
		this.children[1].position.set(48, 0, -50);
		this.children[2].rotateX(Math.PI / 2);
		this.children[2].position.set(48, 0, 50);
	}
}
