import './three.js';

export default class Bullet extends THREE.Object3D {
	axes = new THREE.AxesHelper(10);
	speed = 0;
	velocity = new THREE.Vector3();

	constructor(x, y, z) {
		super();
		this.material = new THREE.MeshBasicMaterial({
			color: 0x00ff00,
			wireframe: false,
		});

		this.geometry = new THREE.SphereGeometry(4, 32, 32);
		this.add(this.axes);
		this.add(new THREE.Mesh(this.geometry, this.material));
		this.position.set(x, y, z);
	}

	toggleAxes() {
		this.axes.visible = !this.axes.visible;
	}
}
