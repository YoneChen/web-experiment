/*global THREE:true*/
import {Scene} from '@/core';
import UserPeer from '@/utils/userPeer';
import {SpaceShip,City,Button} from '@/components';
import CONFIG from '../../config'
import '@/lib/GLTFLoader';
class App extends Scene {
    start() {
        this.roleSet = {};
        this.otherDataList = [];
        this.addCity();
        this.addDirectLight();
        
    }
    loaded() {
        // play the sound
        //  this.envSound.play();
    }
    addSelfRole({ userId, roleData }) {
        this.selfRole = new SelfRole(this.root);
        this.selfRole.camera = this.root.camera;
        this.selfRole.audioListener = this.root.audioListener;
        this.initRole(this.selfRole,roleData.role_transform);
    }
    addAircraft() {
        const aircraft = new Aircraft();
        role.name = userId;
        this.initRole(role,roleData.role_transform);
        role.audioStream = stream;
        this.roleSet[userId] = { model: role };
    }
    initRole(role,{position,rotation}) {
        role.position.set(position.x,position.y,position.z);
        role.rotation.set(rotation.x,rotation.y,rotation.z);
        this.add(role);
    }
    addSpace() {
        const stars1 = new Space({
            num: 6000,
            area: 4000,
            size: 1.5,
            color: "#ffffff"
        });
        const stars2 = new Space({
            num: 5000,
            area: 3000,
            size: 1.8,
            color: "#D3D793"
        });
        const stars3 = new Space({
            num: 2000,
            area: 5000,
            size: 2.2,
            color: "#D3D793"
        });
        this.add(stars1);
        this.add(stars2);
        this.add(stars3);
    }
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
        this.updateAllRoles();
    }
}
export default App;