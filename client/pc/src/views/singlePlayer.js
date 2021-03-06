/*global THREE:true*/
import {Scene} from '@/core';
import GameManager from '@/utils/game/game';
import {Aircraft,City,Button} from '@/components';
import '@/lib/GLTFLoader';
const socketUrl = `ws://${location.hostname}:8086`,
mobileUrl = `http://10.66.68.91:8087/html/`;
class App extends Scene {
    start() {
        this.root.renderer.setClearColor(0x519EcB);
        this.root.scene.fog = new THREE.FogExp2( 0xd0e0f0, 0.001 );
        this.root.camera.position.set(0,200,500);        
        this.root.camera.rotation.set(-Math.PI/4,0,0);
        this.root.game = new GameManager(socketUrl,mobileUrl);
        this.root.game.onPlayerData = this.onPlayerData.bind(this);
        this.root.game.onPlayerJoin = this.onPlayerJoin.bind(this);
        this.root.game.onPlayerLeave = this.onPlayerLeave.bind(this);
        this.addCity(); // 添加城市
        this.addDirectLight(); // 添加灯光
        
    }
    loaded() {
        // this.root.game.showEntryCode();
        // play the sound
        //  this.envSound.play();
    }
    // addSelfRole({ userId, roleData }) {
    //     this.selfRole = new SelfRole(this.root);
    //     this.selfRole.camera = this.root.camera;
    //     this.selfRole.audioListener = this.root.audioListener;
    //     this.initRole(this.selfRole,roleData.role_transform);
    // }
    onPlayerJoin(player) {
        console.log(player.id,'玩家加入游戏');
        this.addAircraft(player);
    }
    onPlayerLeave(player) {
        console.log(player.id,'玩家已离开');
        this.removeAircraft(player);
    }
    onPlayerData(player) {
        this.setAircraftData(this.aircraft,player);
    }
    addCity() {
        const city = new City();
        this.add(city);
    }
    addAircraft(player) {
        if (this.aircraft) this.removeAircraft();
        const aircraft = new Aircraft(this.root);
        this.setAircraftData(aircraft,player);
        aircraft.position.set(0,10,500);        
        // window.aircraft = aircraft;
        this.add(aircraft);
        this.aircraft = aircraft;
    }
    removeAircraft() {
        this.remove(this.aircraft)
    }
    setAircraftData(aircraft,player) {
        let {position, rotation} = player;
        // aircraft.position.set(position.x,position.y,position.z);
        aircraft.rotation.set(rotation.x,rotation.y,rotation.z);
        let v = new THREE.Vector3(0,0,-1);
        v.applyQuaternion(aircraft.quaternion).normalize();
        aircraft.translateOnAxis(v,player.speed);
        if (player.shot) console.log('玩家开火了');
        if (player.shot) aircraft.fire();
    }
    // initRole(role,{position,rotation}) {
    //     role.position.set(position.x,position.y,position.z);
    //     role.rotation.set(rotation.x,rotation.y,rotation.z);
    //     this.add(role);
    // }
    // addSpace() {
    //     const stars1 = new Space({
    //         num: 6000,
    //         area: 4000,
    //         size: 1.5,
    //         color: "#ffffff"
    //     });
    //     const stars2 = new Space({
    //         num: 5000,
    //         area: 3000,
    //         size: 1.8,
    //         color: "#D3D793"
    //     });
    //     const stars3 = new Space({
    //         num: 2000,
    //         area: 5000,
    //         size: 2.2,
    //         color: "#D3D793"
    //     });
    //     this.add(stars1);
    //     this.add(stars2);
    //     this.add(stars3);
    // }
    updateAllRoles() {
        this.updateSelfRole();
        this.updateOtherRoles();
    }
    updateSelfRole() {
        if(!this.selfRole) return;
        this.selfRole.update();
        this.userPeer.sendRoleData({camera_transform: this.selfRole.roleInfo});
    }
    updateOtherRoles() {
        Object.keys(this.roleSet).forEach(userid => {
            const {model} = this.roleSet[userid];
            model.update();
        })
    }
    receiveRoleData({userId,roleData}) {
        const {model} = this.roleSet[userId];
        if (!model) return;
        model.roleInfo = roleData.camera_transform;
        // if(speaker) speaker.update(roleData.position);
    }
    removeRole({userId}) {
        const {model} = this.roleSet[userId];
        if (!model) return;
        this.remove(model);
        delete this.roleSet[userId];
    }
    addDirectLight() {
        // create the enviromental light
        this.add(new THREE.AmbientLight(0xeeeeee));
        let light = new THREE.DirectionalLight(0xffffff, 0.75);
        light.position.set(50, 50, -50);
        light.castShadow = true;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 10;
        light.shadow.camera.far = 500;
        this.add(light);
    }
    update() {
        if (this.aircraft) this.aircraft.update();
        // this.aircraft.position.y -= 0.1;
    }
}
export default App;