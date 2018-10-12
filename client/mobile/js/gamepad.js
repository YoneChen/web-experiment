// class Gamepad {
//     constructor() {
//         this.orientation = {};
//         this._init();
//         this._bindEvent();
//     }
//     _init() {
//         if (!/Android|iPhone|iPad/i.test(navigator.userAgent) || !window.DeviceOrientationEvent) {
//             alert('该设备不支持陀螺仪');
//             return;
//         }
//         this.buttonA = new GamepadButton()
//     }
//     _bindEvent() {
//         let handleOrientation = event => {
//             this.orientation.x = event.beta;
//             this.orientation.x = event.beta;
//             this.orientation.z = event.alpha;
//         }
//         window.addEventListener('deviceorientation',handleOrientation.bind(this));
//     }
// }
class Base {
    constructor(el) {
        this.el = el;
        this.controlList = [];
        this._init();
        this.start();
        window.requestAnimationFrame(this._render.bind(this));
    }
    addControl(control) {
        this.controlList.push(control);
    }
    removeControl(control) {
        this.controlList.splice(this.controlList.indexOf(control),1);
    }
    _init() {
        const { el } = this;
		// 初始化场景
        let canvas = document.createElement('canvas');
        canvas.style.width = el.clientWidth + 'px', canvas.style.height = el.clientHeight + 'px';
        canvas.width = el.clientWidth * window.devicePixelRatio, canvas.height = el.clientHeight * window.devicePixelRatio;
        el.appendChild(canvas);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }
    _render() {
        const {canvas,ctx} = this;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        this.controlList.forEach(control => control.draw());
        this.update();
        window.requestAnimationFrame(this._render.bind(this));
    }
    start() {
        // let buttonA = new GamepadButton();
        // this.addControl(buttonA);
    }
    update() {}
}
class Gamepad extends Base {
    constructor(el) {
        super(el);
        this.orientation = {x: 0, y: 0, z: 0};
        this._dataUpdate = () => {}
    }
    onData(callback) {
        this._dataUpdate = callback;
    }
    _bindEvent() {
        const {canvas} = this;
        // 陀螺仪数据
        let handleOrientation = event => {
            this.orientation.x = event.beta;
            this.orientation.x = event.beta;
            this.orientation.z = event.alpha;
        }
        window.addEventListener('deviceorientation',handleOrientation.bind(this));
        // 按钮控件
        let isTrigger = (touch,control) => {
            touch.pageX > control.left && touch.pageY > control.top && touch.pageX < control.right && control.pageY < control.bottom;
        }
        let handleTouch = callback => event => {
            event.changedTouches.forEach(touch => {
                this.controlList.forEach(control => isTrigger(touch,control) && callback(control));
            })
        }
        canvas.addEventListener('touchstart',handleTouch(control => {
            control.touched = true;
        }).bind(this));
        canvas.addEventListener('touchmove',handleTouch(control => {
            control.touched = false;
        }).bind(this));
        canvas.addEventListener('touchend',handleTouch(control => {
            control.touched = false;
        }).bind(this));
    }
    get gamepadData() {
        const {orientation,controlList} = this;
        return {
            orientation,
            controlList
        }
    }
    start() {
        this._bindEvent();
        // let buttonA = new GamepadButton();
        // this.addControl(buttonA);
    }
    update() {
        this._dataUpdate(this.gamepadData);
    }
}
// 手柄元组件
class GamepadControl {
    constructor(ctx, {x,y,size,enable,style}) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.left = x - size;
        this.top = y - size;
        this.right = x + size;
        this.bottom = y + size;
        this.size = size;
        this.text = text;
        this.image = image;
        this.enable = enable;
    }
    draw() {}
}
// 手柄按钮
class GamepadButton extends GamepadControl {
    constructor(ctx, {x,y,size,enable,style}) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.left = x - size;
        this.top = y - size;
        this.right = x + size;
        this.bottom = y + size;
        this.size = size;
        this.text = text;
        this.image = image;
        this.enable = enable;
    }
    get isPressed() {
        return this._isPressed;
    }
    draw() {
        const {ctx,x,y,size,style} = this;
        ctx.arc(x,y,size,0,Math.PI * 2);
        ctx.fillText(style.text)
    }
}
// class GamepadTouchPad {
//     constructor
// }
// class UIButton {
//     constructor(ctx,{x,y,size,text,image}) {
//         this.ctx = ctx;
//         this.x = x;
//         this.y = y;
//         this.size = size;
//         this.text = text;
//         this.image = image;
//     }
// }