import Player from './player'
import Msg from './message'
export function showQRCode() {
    
}
const MSG_LIST = { CREATE_GAME: 'CREATE_GAME' };
class GameManager {
    constructor(url) {
        // 建立websocket连接
        this.ws = new WebSocket(url);
        this.ws.addEventListener('message',({data}) => {
            const msg = JSON.parse(data);
            this.onData(res);
        });
    }
    createGame() {
        const msg = new Msg(MSG_LIST.CREATE_GAME);
        this.send(msg);
    }

    createPlayer(options) {
        let player = new Player(options);
        showQRCode();
        this._playerList.push()
    }
    onData(msg) {
        
    }
    send(msg) {
        this.ws.send(JSON.stringify(msg));
    }
}