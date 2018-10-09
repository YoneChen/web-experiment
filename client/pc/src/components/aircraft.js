const {Object3D} = THREE;
import {getGLTFModel,getTexture} from '@/utils/common';
const MODEL_CITY_PATH = 'model/robot/scene.gltf';
class Aircraft extends Object3D {
    constructor(root) {
        super();
        this.audioListener = root.audioListener;
        this.name = '';
        this._isLoaded = false;
        this._roleInfo = {
            rotation: {x:0,y:0,z:0},
            position: {x:0,y:0,z:0}
        }
        this._init();
    }
    async _init() {
        const {scene: model} = await getGLTFModel(MODEL_CITY_PATH);
        model.scale.set(0.01,0.01,0.01);
        model.position.set(0,-17,3);
        this.paltform = model;
    }
    _loaded() {}
    onLoad(callback) {
        this._loaded = callback;
    }
    update() {
        const {headBone,group} = this;
        if (!headBone || !group) return;
        this._updateModel();
    }
    _updateModel() {
        const {position,rotation} = this.roleInfo;
        this.headBone.rotation.set( rotation.y,0,rotation.x );
        this.group.rotation.set(0,rotation.y,0);
        this.group.position.set(position.x,position.y,position.z);
        // this.object3d.position.fromArray( camera.position );
        this.updateMatrix();
        this.visible = true;
    }
}
export default Aircraft;