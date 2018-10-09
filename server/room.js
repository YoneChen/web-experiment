class Room {
    constructor(name) {
        this.id = Date.now();
        this.name = name;
        this.playerList = [];
    }
    addPlayer(player) {
        this.playerList.push(player);
    }
    removePlayer(player) {
        this.playerList.splice(this.playerList.indexOf(player),1);
    }
    removeAllPlayers() {
        this.playerList = [];
    }
}
export default Room;