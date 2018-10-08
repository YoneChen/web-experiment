class Player {
    constructor(name) {
        this.id = Date.now();
        this.name = name;
        this.position = {};
        this.rotation = {};
        this.blood = 100;
        this.speed = 1;
    }
}