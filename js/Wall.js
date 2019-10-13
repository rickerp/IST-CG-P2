export default class Wall{
    object = null;
    material = null;

    constructor(x, y, z){
        this.object = new THREE.Object3D();
        this.material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: false
        });

        this.createWall(0, 0, 0);

        this.object.position.set(x, y, z);
    }

    createWall(x, y, z){
        let geometry = new THREE.CubeGeometry(10, 4, 20);
        let mesh = new THREE.Mesh(geometry, this.material);
        mesh.position.set(x, y, z)
        this.object.add(mesh);
    }
}