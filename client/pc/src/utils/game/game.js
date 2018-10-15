// import Player from './player'
import Msg from './message'
import QRCode from 'qrcode'
export async function showQRCode(url) {
    return QRCode.toDataURL(url)
}
const MSG_TYPES = {
    playerData: 'PLAYER_DATA',
    hostJoin: 'HOST_JOIN',
    hostLeave: 'HOST_LEAVE',
    playerJoin: 'PLAYER_JOIN',
    playerLeave: 'PLAYER_LEAVE',
    connected: 'CONNECTED',
    // createGame: 'CREATE_GAME',
    gameData: 'GAME_DATA'
}
class GameManager {
    constructor(socketUrl,mobileUrl) {
        // 建立websocket连接
        this.ws = new WebSocket(socketUrl);
        this.ws.addEventListener('message',({data}) => {
            const msg = JSON.parse(data);
            switch(msg.name) {
                case MSG_TYPES.connected: this._createGame();break;
                case MSG_TYPES.playerJoin: this._playerJoin(msg.body);break;
                case MSG_TYPES.playerData: this.onPlayerData(msg.body);break;
                case MSG_TYPES.playerLeave: this._playerLeave(msg.body);break;
                case MSG_TYPES.gameData: this.onGameData(msg.body);break;
            }
        });
        this._playerList = [];
        this.mobileUrl = mobileUrl;
    }
    _createGame() { // 请求游戏初始数据
        // const msg = new Msg({ name: MSG_TYPES.createGame });
        this.send({ name: MSG_TYPES.hostJoin });
        this.showEntryCode(this.mobileUrl);
    }

    _addPlayer(player) {
        this._playerList.push(player);
    }
    _removePlayer(player) {
        this._playerList.splice(this._playerList.indexOf(player),1);
    }
    showEntryCode(mobileUrl,gameData) {
        let canvas = document.createElement('canvas');
        QRCode.toCanvas(canvas, mobileUrl, function (error) {
            if (error) console.error(error)
            console.log('success!');
          });
        let wrap = document.querySelector('.qrcode-wrap');
        wrap.appendChild(canvas);
        let text = document.createElement('h4');
        text.style.textAlign = 'center';
        text.innerText = '扫码玩玩';
        wrap.appendChild(text);
    }
    onPlayerJoin(player) {} // 手机玩家已加入
    onPlayerLeave(player) {} // 手机玩家已离开
    onPlayerData(player) {} // 获取玩家数据
    _playerJoin(player) {
        this._addPlayer(player);
        this.onPlayerJoin(player);
    }
    _playerLeave(player) {
        this._removePlayer(player);
        this.onPlayerLeave(player);
    }
    onData(msg) {
        
    }
    send(msg) {
        this.ws.send(JSON.stringify(msg));
    }
}
export default GameManager