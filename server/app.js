
const WebSocket = require('ws');
const port = 8086;
const Game = require('./room');
const Player = require('./player')
const MSG_TYPES = {
    playerDataSend: 'PLAYER_DATA_SEND',
    hostJoin: 'HOST_JOIN',
    hostLeave: 'HOST_LEAVE',
    mobileJoin: 'MOBILE_JOIN',
    mobileLeave: 'MOBILE_LEAVE',
    connected: 'CONNECTED'
}
class GameServer {
    constructor(port) {
        let wss = new WebSocket.Server({ port });
        wss.on('connection', function connection(ws) {
            ws.send(JSON.stringify({
                name: MSG_TYPES.connected
            }));
            // connectionFeedback(wss,ws); // 新用户连接，通知该用户其他用户的userId，通知其他用户该用户的userId
            ws.on('message', function incoming(data) {
                const msg = JSON.parse(data);
                switch(msg.name) {
                    case MSG_TYPES.hostJoin: this.hostJoin(ws); break;
                    case MSG_TYPES.mobileJoin: this.mobileJoin(ws); break;
                    case MSG_TYPES.playerDataSend: this.playerDataSend(ws,msg); break; // 手机控制器数据发送给主机
                }
            });
        });
    }
    hostJoin(ws) {
        this.game = new Game();
        this.game.ws = ws;
    }
    mobileJoin(ws) {
        let player = new Player();
        player.ws = ws;
        this.game.addPlayer(player);
        // ws.send()
    }
    getPlayerByWS(ws) {
        return this.game.playerList.find(player => player.ws === ws);
    }
    // 手机控制器数据发送给主机
    playerDataSend(ws,msg) {
        let player = getPlayerByWS(ws);
        if(!player) return;
        Object.assign(player,msg.body);
        this.game.ws.send(JSON.stringify(msg));
    }
} 
new GameServer(port);
function broadcast(wss,ws,data) {
    // Broadcast to everyone else.
    wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });

}