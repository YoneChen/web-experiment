const {Object3D} = THREE;
import {getGLTFModel,getTexture} from '@/utils/common';
class Bullet extends Object3D {
    constructor() {
        super();
        // this.audioListener = root.audioListener;
        this.name = 'bullet';
        this._init();
    }
    _init() {
        let geometry = new THREE.CylinderGeometry( 0.02, 0.02, 3, 8 );
        let material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        let cylinder = new THREE.Mesh( geometry, material );
        this.add(cylinder);
    }
    update() {
    }
}
export default Bullet;