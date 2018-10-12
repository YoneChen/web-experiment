module.exports = function(player,gampadData) {
    if(!gampadData) {
        player.position = {x: 0, y: 50, z: 4};
        return;
    }
    player.orientation = gampadData.orientation;
    player.position = {x: 0, y: 50, z: 4};
}