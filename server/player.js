class Player {
    constructor(name) {
        this.id = Date.now();
        this.name = name;
        this.position = {x: 0, y: 0, z: 0};
        this.rotation = {x: 0, y: 0, z: 0};
        this.blood = 100;
        this.speed = 1;
        this.shot = 1;
    }
}
module.exports = Player;