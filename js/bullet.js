import './three.js';

export default class Bullet extends THREE.Object3D {
	constructor(x, y, z, angle) {
		super();
		this.material = new THREE.MeshBasicMaterial({
			color: 0x00ff00,
			wireframe: false,
		});
		this.collision = true; // after the collision the ball should lose speed because of friction
		this.speed = Math.random() * 100 + 100;
		this.geometry = new THREE.SphereGeometry(4, 32, 32);
		this.velocity = new THREE.Vector3();
		this.velocity.set(0, 0, 1); // the balls only travel along their z axis
		this.add(new THREE.AxesHelper(10));
		this.add(new THREE.Mesh(this.geometry, this.material));
		this.rotateY(angle - Math.PI / 2);
		this.position.set(x, y, z);
	}
}
