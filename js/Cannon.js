import Bullet from "./Bullet.js"

export default class Cannon{
    object = null;
    barrel = null;
    shootingPos = null;
    
    constructor(x, y ,z){
        this.object = new THREE.Object3D();
        this.material = new THREE.MeshBasicMaterial({
            wireframe: false
        });

        this.createBase(0, 1, 0);
        this.createBarrel(-7, 5, 0);

        this.shootingPos = new THREE.Object3D();
        this.shootingPos.position.set(-21, 5, 0);
        // this.shootingPos.add(new THREE.AxesHelper(4));
        this.object.add(this.shootingPos);

        this.object.position.set(x, y, z);
    }

    createBase(x, y, z){
        let geometry = new THREE.CubeGeometry(20, 2, 10);
        let material = new THREE.MeshBasicMaterial({
            wireframe: false,
            color: 0x993e14
        });

        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);

        this.object.add(mesh);
    }

    createBarrel(x, y, z){
        let geometry = new THREE.CylinderGeometry(4,4,20,32);
        let material = new THREE.MeshBasicMaterial({
            wireframe: false,
            color: 0x808080
        });

        let mesh = new THREE.Mesh(geometry, material);
        this.barrel = mesh;
        this.rotateBarrel(Math.PI/2);
        mesh.position.set(x, y, z);
        this.object.add(mesh);
    }

    rotateBarrel(value){
        this.barrel.rotateZ(value);
    }

    shootBullet(){
        return new Bullet(
            this.shootingPos.position.x, 
            this.shootingPos.position.y,
            this.shootingPos.position.z
            );

    }
}