import './three.js';

export default class Bullet extends THREE.Object3D {
	axes = new THREE.AxesHelper(10);
	radius = 3;
	velocity = new THREE.Vector3();

	constructor(x, y, z) {
		super();
		this.material = new THREE.MeshStandardMaterial({
			color: 0x666666,
			wireframe: false,
		});

		this.geometry = new THREE.SphereGeometry(this.radius, 32, 32);
		this.add(this.axes);
		this.add(new THREE.Mesh(this.geometry, this.material));
		this.position.set(x, y, z);
	}
}
