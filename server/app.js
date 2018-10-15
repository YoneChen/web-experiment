
const WebSocket = require('ws');
const port = 8086;
const Game = require('./room');
const Player = require('./player')
const MSG_TYPES = {
    playerData: 'PLAYER_DATA',
    hostJoin: 'HOST_JOIN',
    hostLeave: 'HOST_LEAVE',
    playerJoin: 'PLAYER_JOIN',
    playerLeave: 'PLAYER_LEAVE',
    connected: 'CONNECTED',
    createGame: 'CREATE_GAME',
    gameData: 'GAME_DATA'
}
class GameServer {
    constructor({
        port,
        gameDataProcessor
    }) {
        this.wss = new WebSocket.Server({ port });
        this.wss.on('connection', this._connection.bind(this));
        this.gameDataProcessor = gameDataProcessor;
    }
    _connection(ws) {
        ws.send(JSON.stringify({
            name: MSG_TYPES.connected
        }));
        // connectionFeedback(wss,ws); // 新用户连接，通知该用户其他用户的userId，通知其他用户该用户的userId
        ws.on('message', data => {
            this.clearDisconnectedPlayers();
            const msg = JSON.parse(data);
            switch(msg.name) {
                case MSG_TYPES.hostJoin: this.hostJoin(ws); break;
                case MSG_TYPES.playerJoin: this.playerJoin(ws,msg); break;
                case MSG_TYPES.playerData: this.playerDataSend(ws,msg); break; // 玩家数据发送给主机
                // case MSG_TYPES.createGame: this.gameDataSend(ws); break; // 游戏数据发送给主机
            }
        });
    }
    hostJoin(ws) {
        this.game = new Game();
        this.game.ws = ws;
    }
    playerJoin(ws,msg) {
        let player = new Player();
        this.gameDataProcessor(player);
        this.game.addPlayer(player);
        msg.body = player;
        this.game.ws.send(JSON.stringify(msg));
        player.ws = ws;
    }
    gameDataSend(ws) {
        // this.game.ws.send();
    }
    getPlayerByWS(ws) {
        return this.game.playerList.find(player => player.ws === ws);
    }
    clearDisconnectedPlayers() { // 清理断开连接的玩家
        if (!this.game || !this.game.playerList.length) return;
        let disconnetedPlayers = this.game.playerList.filter(player => player.ws.readyState === WebSocket.CLOSED);
        if (disconnetedPlayers.length) disconnetedPlayers.forEach(player => {
            console.log(player.id,'disconneted');
            let msg = {
                name: MSG_TYPES.playerLeave,
                body: player
            }
            this.game.ws.send(JSON.stringify(msg));
            this.game.removePlayer(player);
        })
    }
    // 手机控制器数据发送给主机
    playerDataSend(ws,msg) {
        let player = this.getPlayerByWS(ws);
        if(!player) return;
        let gamepadData = msg.body;
        this.gameDataProcessor(player,gamepadData);
        // Object.assign(player,msg.body);
        // msg.player = player.id;
        msg.body = player;
        this.game.ws.send(JSON.stringify(msg));
    }
} 
new GameServer({
    port,
    gameDataProcessor: require('./game/singlePlayer')
});
function broadcast(wss,ws,data) {
    // Broadcast to everyone else.
    wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });

}