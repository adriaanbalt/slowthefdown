import Level from './index'

export default class VortexLevel extends Level {
    constructor( options ){
        const texture = await ExpoTHREE.loadTextureAsync({
        asset: require("../../assets/images/stars.jpg")
        });
        const vortex = new Vortex(texture);
        this.vortexMesh = vortex.getMesh();
    }
    getMesh = () => {
        return this.vortexMesh
    }
}