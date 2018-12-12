import { THREE } from "expo-three";
import { BasicAnimationMaterial } from "three-bas"
import ParticlePrefabGeometry from './ParticlePrefabGeometry'

export default class Animation {

    //(20, 10, 40, 10000, 0.01 )
    constructor(width, height, depth, prefabCount, prefabSize) {
        // create a prefab
        var prefab = new THREE.TetrahedronGeometry(prefabSize);

        // create a geometry where the prefab is repeated 'prefabCount' times
        this.geometry = new ParticlePrefabGeometry(prefab, prefabCount);

        // add a time offset for each prefab, spreading them out along the Z axis
        this.geometry.createAttribute('aOffset', 1, function (data, i, count) {
            data[0] = i / count;
        });

        // create a start position for each prefab
        var aStartPosition = this.geometry.createAttribute('aStartPosition', 3);
        // create an end position for each prefab
        var aEndPosition = this.geometry.createAttribute('aEndPosition', 3);
        var x, y, data = [];

        // for each prefab
        for (var i = 0; i < prefabCount; i++) {
            // get a random x coordinate between -width/2 and width/2
            x = THREE.Math.randFloatSpread(width);
            // get a random y coordinate between 0 and height
            y = THREE.Math.randFloat(0, height);

            // store the coordinates in the buffer attribute
            // x and y are the same for start and end position, causing each prefab to move in a straight line
            data[0] = x;
            data[1] = y;
            // all prefabs start at depth * -0.5
            data[2] = depth * -0.5;
            this.geometry.setPrefabData(aStartPosition, i, data);

            data[0] = x;
            data[1] = y;
            // all prefabs end at depth * 0.5
            data[2] = depth * 0.5;
            this.geometry.setPrefabData(aEndPosition, i, data);
        }

        this.material = new BasicAnimationMaterial({
            side: THREE.DoubleSide,
            uniforms: {
                uTime: { value: 0.0 },
                uDuration: { value: 1.0 },
                uScale: { value: 1.0 }
            },
            uniformValues: {
                diffuse: new THREE.Color(0xf1f1f1)
            },
            vertexParameters: [
                'uniform float uTime;',
                'uniform float uDuration;',
                'uniform float uScale;',

                'attribute float aOffset;',
                'attribute vec3 aStartPosition;',
                'attribute vec3 aEndPosition;'
            ],
            vertexPosition: [
                // calculate a time based on the uniform time and the offset of each prefab
                'float tProgress = mod((uTime + aOffset), uDuration) / uDuration;',
                // scale the z axis based on the uniform speed scale
                'transformed.z *= uScale;',
                // translate between start and end position based on progress
                'transformed += mix(aStartPosition, aEndPosition, tProgress);'
            ]
        });
            
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.frustumCulled = false;
    }

    getMesh() {
        return this.mesh;
    }
    update(delta) {
        this.material.uniforms['uTime'].value += delta;
    }
    setScale(scale) {
        this.material.uniforms['uScale'].value = scale;
    }
    
}