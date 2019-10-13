export default class Bullet {
    object = null;
    material = null;

    constructor(x, y, z) {
        this.object = new THREE.Object3D();
        this.material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: false,
        });

        this.createBullet(0, 0, 0);

        this.object.position.set(x, y, z);
    }

    createBullet(x, y, z) {
        let geometry = new THREE.SphereGeometry(4, 32, 32);
        let mesh = new THREE.Mesh(geometry, this.material);
        mesh.position.set(x, y, z);
        this.object.add(mesh);
    }
}
