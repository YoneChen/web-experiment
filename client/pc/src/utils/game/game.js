// import Player from './player'
import Msg from './message'
import QRCode from 'qrcode'
export function showQRCode() {
    
}
const MSG_TYPES = {
    playerData: 'PLAYER_DATA',
    hostJoin: 'HOST_JOIN',
    hostLeave: 'HOST_LEAVE',
    playerJoin: 'PLAYER_JOIN',
    mobileLeave: 'MOBILE_LEAVE',
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
            }
        });
        this._playerList = [];
    }
    _createGame() { // 请求游戏初始数据
        // const msg = new Msg({ name: MSG_TYPES.createGame });
        this.send({ name: MSG_TYPES.hostJoin });
    }

    _addPlayer(player) {
        // let player = new Player(options);
        this._playerList.push(player);
        // return player;
    }
    showEntryCode(player) {
        
    }
    onPlayerJoin(player) {}
    onPlayerData(player) {}
    _playerJoin(player) {
        this._addPlayer(player);
        this.onPlayerJoin(player);
    }
    onData(msg) {
        
    }
    send(msg) {
        this.ws.send(JSON.stringify(msg));
    }
}
export default GameManager