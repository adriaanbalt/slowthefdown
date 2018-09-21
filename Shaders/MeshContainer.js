import React from "react";
import ExpoTHREE, { THREE } from "expo-three"; // 3.0.0-alpha.4

export default class MeshContainer extends React.Component {

    constructor() {
        super();
        let geometry = new THREE.CircleGeometry(.25, 10);
        let material = new THREE.MeshBasicMaterial({
            color: 0xFF00FF,
            opacity: 1
        });
        this.mesh = new THREE.Mesh(geometry, material);
    }

    getMesh() {
        // this.mesh.superName = 'MovingLetter'
        return this.mesh
    }

}
