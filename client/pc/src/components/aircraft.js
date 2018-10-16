const {Object3D} = THREE;
import Bullet from './bullet'
import {getGLTFModel,getTexture} from '@/utils/common';
const MODEL_PATH = 'model/aircraft/flying sacuer.gltf';
const AUDIO_PATH = 'audio/fire.mp3';
class Aircraft extends Object3D {
    constructor(root) {
        super();
        this.audioListener = root.audioListener;
        this.camera = root.camera;
        this.name = '';
        this._isLoadedAudio = false;
        this._init();
    }
    async _init() {
        this._initfireSound();
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
        bullet.rotation.x = Math.PI * 2 /3;
        this.add(bullet);
        this.flyAnimate(bullet);
        this.playFireSound();
    }
    _initfireSound() {

        // load a sound and set it as the PositionalAudio object's buffer
        var audioLoader = new THREE.AudioLoader();
        audioLoader.load( AUDIO_PATH,  buffer => {
            this._isLoadedAudio = true;
            this.soundbuffer = buffer;
        });
    }
    playFireSound() {
        let sound = new THREE.PositionalAudio( this.audioListener );
        if (!this._isLoadedAudio) return;
        sound.setBuffer( this.soundbuffer );
        sound.setRefDistance( 20 );
        this.add(sound);
        sound.play();
    }
    flyAnimate(bullet) {
        let animate =  new TWEEN.Tween({ y: 0, z: 0 })
		.to({ y: -500, z: -1000 }, 10000)
		.onUpdate(({ y, z }) => {
			bullet.position.y = y;
			bullet.position.z = z;
		})
		.onStop(() => {
			this.remove(bullet);
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