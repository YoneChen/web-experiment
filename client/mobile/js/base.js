class Base {
    constructor(el) {
        this.el = el;
        this._init();

    }
    _init() {
        const { el } = this;
		// 初始化场景
		this.scene = new THREE.Scene();
		// 初始化相机
		this.camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 1000);
		this.scene.add(this.camera);

		// 初始化渲染器
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(el.clientWidth, el.clientHeight);
		this.renderer.shadowMapEnabled = true;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        el.appendChild(this.renderer.domElement);
        this.gl = this.renderer.getContext();
    }
    start() {}
    update() {}
}