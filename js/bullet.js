import './three.js';

export default class Bullet extends THREE.Object3D {
	constructor(x, y, z, angle) {
		super();
		this.material = new THREE.MeshBasicMaterial({
			color: 0x00ff00,
			wireframe: false,
		});

		this.speed = 170 + Math.random() * 20;
		this.geometry = new THREE.SphereGeometry(4, 32, 32);
		this.velocity = new THREE.Vector3();
		this.velocity.set(
			Math.sin(angle - Math.PI / 2),
			0,
			Math.cos(angle - Math.PI / 2)
		);
		this.add(new THREE.AxesHelper(10));
		this.add(new THREE.Mesh(this.geometry, this.material));
		this.position.set(x, y, z);
	}
}
