class GamePad {
    constructor() {
        this._init();
    }
    _init() {
        if (!/Android|iPhone|iPad/i.test(navigator.userAgent) || !window.DeviceOrientationEvent) {
            alert('该设备不支持陀螺仪');
            return;
        }

    }
    _bindEvent() {
        window.addEventListener('deviceorientation',)
    }
}