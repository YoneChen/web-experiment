const {Object3D} = THREE;
import {getGLTFModel,getTexture} from '@/utils/common';
const MODEL_CITY_PATH = 'model/city/model.gltf';
class City extends Object3D {
    constructor(root) {
        super();
        // this.audioListener = root.audioListener;
        this.name = 'city';
        this._isLoaded = false;
        this._init();
    }
    async _init() {
        const {scene: model} = await getGLTFModel(MODEL_CITY_PATH);
        this._isLoaded = true;
        model.scale.set(100,100,100);
        model.position.set(0,400,0);
        this.add(model);
    }
    _loaded() {}
    onLoad(callback) {
        this._loaded = callback;
    }
}
export default City;