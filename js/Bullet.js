import './three.js';
('use strict');

export default class Bullet extends THREE.Mesh {
	constructor(x, y, z) {
		this.material = new THREE.MeshBasicMaterial({
			color: 0x00ff00,
			wireframe: false,
		});
		this.geometry = new THREE.SphereGeometry(4, 32, 32);
		super(this.geometry, this.material);
		this.position.set(x, y, z);
	}
}
