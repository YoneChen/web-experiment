module.exports = function(player,gampadData,gameData) {
    if(!gampadData) {
        player.position = {x: 0, y: 200, z: 500};
        return;
    }
    gampadData.controlList.forEach(control => {
        switch(control.name) {
            case '走': changePlayerSpeed(player,control)
            case '打': changePlayerShot(player,control)
        }
    })
    // player.rotation.y = gampadData.orientation.y /4;
    let d1 = gampadData.orientation.y - gampadData.origin.orientation.y;
    let d2 = gampadData.orientation.x - gampadData.origin.orientation.x;
    if (Math.abs(d1) > Math.PI) {
        d1 = d1 > 0 ? d1 - 2 * Math.PI : 2 * Math.PI - d1;
    }
    player.rotation.y += d1;
    player.rotation.x += d2;
}
function changePlayerSpeed(player,control) {
    if (control.touched) player.speed = 1;
    else player.speed = 0;
    // let {rotation} = player;
    // player.position.x += 1 * Math.cos(rotation.z);
    // player.position.y += 1 * Math.cos(rotation.z);
}
function changePlayerShot(player,control) {
    if (control.tapped) player.shot = 1;
    else player.shot = 0;
    // let {rotation} = player;
    // player.position.x += 1 * Math.cos(rotation.z);
    // player.position.y += 1 * Math.cos(rotation.z);
}