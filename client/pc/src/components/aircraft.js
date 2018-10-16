const {Object3D} = THREE;
import Bullet from './bullet'
import {getGLTFModel,getTexture} from '@/utils/common';
const MODEL_PATH = 'model/aircraft/flying sacuer.gltf';
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
        this.camera.position.set(0, 4, 4);
        // this.camera.rotation.set(Math.PI/4,0,0);
        // model.position.set(0,-4,-4);
        // model.scale.set(1,1,1);
        this.add(model);
        this.model = model;
        this.add(this.camera);
        // this.camera.rotation.set(-Math.PI/4, 0, 0);
    }
    fire() {
        let bullet = new Bullet();
        bullet.rotation.x = Math.PI/2;
        this.add(bullet);
        this.fly(bullet);
    }
    fly(bullet) {
        let animate =  new TWEEN.Tween({ z: 0 })
		.to({ z: -1000 }, 10000)
		.onUpdate(({ z }) => {
			bullet.position.z = z;
		})
		.onStop(() => {
			bullet.visible = false;
        });
        animate.start();
    }
    _loaded() {}
    onLoad(callback) {
        this._loaded = callback;
    }
    update() {
        if(this.model) this.model.rotation.y += 0.1;
    }
}
export default Aircraft;