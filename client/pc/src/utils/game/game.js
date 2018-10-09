import Player from './player'
import Msg from './message'
export function showQRCode() {
    
}
const MSG_LIST = { CREATE_GAME: 'CREATE_GAME' };
class GameManager {
    constructor(socketUrl,mobileUrl) {
        // 建立websocket连接
        this.ws = new WebSocket(socketUrl);
        this.ws.addEventListener('message',({data}) => {
            const msg = JSON.parse(data);
            this.onData(res);
        });
    }
    createGame() {
        const msg = new Msg(MSG_LIST.CREATE_GAME);
        this.send(msg);
    }

    addPlayer(options) {
        let player = new Player(options);
        this._playerList.push(player);
        return player;
    }
    showEntryCode(player) {

    }
    onData(msg) {
        
    }
    send(msg) {
        this.ws.send(JSON.stringify(msg));
    }
}
export default GameManager