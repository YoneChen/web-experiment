class GamePad {
    constructor({orientation}) {
        this.orientation = {};
        this._initOrientation = orientation;
        this._init();
    }
    _init() {
        if (!/Android|iPhone|iPad/i.test(navigator.userAgent) || !window.DeviceOrientationEvent) {
            alert('该设备不支持陀螺仪');
            return;
        }

    }
    _bindEvent() {
        const {_initOrientation,orientation} = this;
        let _handleOrientation = event => {
            orientation.x = _initOrientation.x + event.beta;
            orientation.y = _initOrientation.y + event.gamma;
            orientation.z = _initOrientation.z + event.alpha;
        }
        window.addEventListener('deviceorientation',_handleOrientation.bind(this));
    }
}