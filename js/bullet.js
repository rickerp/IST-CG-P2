import './three.js';

export default class Bullet extends THREE.Object3D {
	constructor(x, y, z) {
		super();
		this.material = new THREE.MeshBasicMaterial({
			color: 0x00ff00,
			wireframe: false,
		});
		this.geometry = new THREE.SphereGeometry(4, 32, 32);
		this.add(new THREE.Mesh(this.geometry, this.material));
		this.position.set(x, y, z);
	}
}
