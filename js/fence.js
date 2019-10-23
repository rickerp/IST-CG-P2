import './three.js';

export default class Fence extends THREE.Object3D {
	constructor(x, y, z) {
		super();
		const loader = new THREE.TextureLoader();
		const texture = loader.load(
			'https://threejsfundamentals.org/threejs/lessons/resources/images/compressed-but-large-wood-texture.jpg'
		);
		this.material = new THREE.MeshBasicMaterial({
			map: texture,
		});
		this.add(new THREE.AxesHelper(50));
		this.addWall(-50, 0, 0);
		this.addWall(0, 0, -50, Math.PI / 2);
		this.addWall(0, 0, 50, Math.PI / 2);
		this.createBase(0, -10, 0);

		this.position.set(x, y, z);
	}

	addWall(x, y, z, angle = 0) {
		let geometry = new THREE.CubeGeometry(4, 20, 100);
		let wall = new THREE.Mesh(geometry, this.material);
		wall.rotateY(angle);
		wall.position.set(x, y, z);
		this.add(wall);
	}

	createBase(x, y, z) {
		let geometry = new THREE.CubeGeometry(100, 4, 104);
		let base = new THREE.Mesh(geometry, this.material);

		this.add(base);
		base.position.set(x, y, z);
	}
}
