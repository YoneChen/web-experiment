
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
        canvas.style.width = el.clientHeight + 'px', canvas.style.height = el.clientWidth + 'px';
        let offest = (el.clientWidth - el.clientHeight)/2;
        canvas.style.transform = `translate(${offest}px,${-offest}px) rotate(90deg)`;
        canvas.width = el.clientHeight * window.devicePixelRatio, canvas.height = el.clientWidth * window.devicePixelRatio;
        el.appendChild(canvas);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        // 按钮控件
        let isTrigger = (touch,control) => {
            let [tx,ty] = [ touch.pageY  * window.devicePixelRatio, (el.clientWidth - touch.pageX)  * window.devicePixelRatio ]
            return tx > control.left && ty > control.top && tx < control.right && ty < control.bottom;
        }
        let handleTouch = callback => event => {
            event.preventDefault();
            Array.from(event.changedTouches).forEach(touch => {
                this.controlList.forEach(control => isTrigger(touch,control) && callback(control));
            })
        }
        canvas.addEventListener('touchstart',handleTouch(control => {
            control.touched = true;
        }).bind(this));
        canvas.addEventListener('touchmove',handleTouch(control => {
            control.touched = true;
        }).bind(this));
        canvas.addEventListener('touchend',handleTouch(control => {
            control.touched = false;
        }).bind(this));
    }
    _render() {
        const {canvas,ctx} = this;
        ctx.fillStyle = "#222222";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.controlList.forEach(control => control.draw(ctx));
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
        this.origin = {};
        this._resetPos();
        this._dataUpdate = () => {}
    }
    onData(callback) {
        this._dataUpdate = callback;
    }
    _bindEvent() {
        const {canvas} = this;
        // 陀螺仪数据
        let handleOrientation = event => {
            this.orientation.x = -event.gamma * Math.PI / 180;
            this.orientation.y = event.alpha * Math.PI / 180;
            this.orientation.z = event.beta;
        }
        window.addEventListener('deviceorientation',handleOrientation.bind(this));
    }
    get gamepadData() {
        const {orientation,controlList,origin} = this;
        return {
            origin,
            orientation,
            controlList: controlList.map(control => control.data)
        }
    }
    start() {
        this._bindEvent();
        let buttonA = new GamepadButton({
            x: 300,
            y: 300,
            size: 100,
            border: {
                width: 5,
                color: '#00aadd'
            },
            font: {
                text: '走',
                size: 50,
                color: '#00aadd'
            }
        });
        this.addControl(buttonA);
        let buttonC = new GamepadButton({
            x: 1600,
            y: 300,
            size: 100,
            border: {
                width: 5,
                color: '#00aadd'
            },
            font: {
                text: '打',
                size: 50,
                color: '#00aadd'
            }
        });
        this.addControl(buttonC);
        // buttonC.onTap = this._resetPos.bind(this);
    }
    _resetPos() {
        this.origin.orientation = Object.assign({},this.orientation);
    }
    update() {
        this._dataUpdate(this.gamepadData);
        this._resetPos();
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
class GamepadButton {
    constructor({x,y,size,enable,border,font}) {
        this.name = font.text;
        this.x = x;
        this.y = y;
        this.left = x - size;
        this.top = y - size;
        this.right = x + size;
        this.bottom = y + size;
        this.size = size;
        this.font = font;
        // this.image = image;
        this.border = border;
        this.enable = enable;
        this._lastTouched = false;
        this._touched = false;
    }
    get data() {
        const {name,touched} = this;
        return {
            name,
            touched
        }
    }
    get touched() {
        return this._touched;
    }
    set touched(val) {
        this._touched = val;
        if (this._touched)  {
            if (!this._lastTouched) {
                navigator.vibrate(100);
                this.onTap();
            }
        }
        this._lastTouched = val;
    }
    onTap() {}
    draw(ctx) {
        const {x,y,size,font,border,background} = this;
        // ctx.fillStyle = backgroundColor;
        ctx.beginPath();
        ctx.arc(x,y,size,0,Math.PI * 2);
        this._stroke(ctx,border);
        ctx.closePath();
        if (this.touched) this._fill(ctx,border);
        else this._stroke(ctx,border);
        // ctx.fillRect(0, 0, _width, _height);
        ctx.font = `${font.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(font.text, x, y);
    }
    _stroke(ctx,border) {
        ctx.lineWidth = border.width;
        ctx.strokeStyle = border.color;
        ctx.stroke();
        ctx.fillStyle = border.color;
    }
    _fill(ctx,border) {
        ctx.fillStyle = border.color;
        ctx.fill();
        ctx.fillStyle = '#ffffff';
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