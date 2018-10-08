class Room {
    constructor(name) {
        this.id = Date.now();
        this.name = name;
        this._playerSet = {};
    }
    getPlayer(playerId) {
        return this._playerSet[playerId];
    }
    addPlayer(playerId,player) {
        this._playerSet[playerId] = player;
    }
    removePlayer(playerId) {
        delete this._playerSet[playerId];
    }
    removeAllPlayers() {
        this._playerSet = {};
    }
}