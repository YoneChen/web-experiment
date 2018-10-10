const {Object3D} = THREE;
import {getGLTFModel,getTexture} from '@/utils/common';
const MODEL_PATH = 'model/aircraft/scene.gltf';
class Aircraft extends Object3D {
    constructor(camera) {
        super();
        // this.audioListener = root.audioListener;
        this.camera = camera;
        this.name = '';
        this._isLoaded = false;
        this._init();
    }
    async _init() {
        const {scene: model} = await getGLTFModel(MODEL_PATH);
        model.rotation.set(0, Math.PI, 0);
        model.position.set(0,-4,-4);
        model.scale.set(0.01,0.01,0.01);
        this.add(model);
        this.add(this.camera);
        this.camera.rotation.set(-Math.PI/4, 0, 0);
    }
    _loaded() {}
    onLoad(callback) {
        this._loaded = callback;
    }
    update() {
    }
}
export default Aircraft;