import React from "react";
import { THREE } from "expo-three";

export default class SpinShader extends React.Component {

    constructor(texture, props={}) {
        super( props );

        this.shader = {
            vertexShader: [
                'varying vec2 vUv;',
                'void main()',
                '{',
                'vUv = uv;',
                'vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );',
                'gl_Position = projectionMatrix * mvPosition;',
                '}',
            ].join("\n"),
            fragmentShader: [
                'precision highp float;',

                'uniform float iTime;',
                'uniform float iProgress;',
                'uniform float iWaves;',
                'uniform float iBrightness;',
                'uniform float iMouseX;',
                'uniform float iMouseY;',
                'uniform sampler2D iText0;',
                'uniform sampler2D iText1;',

                'varying vec2 vUv;',


                'void main()',
                '{',
                'vec2 p = -1.0 + 3.0 * vUv;',
                'vec2 q = p - vec2(0.5, 0.5);',// start pos

                // 'q.x += 0. + sin(iTime * .5) / 1.;', // X distance from center - movement with speed
                // 'q.y += 0. + sin(iTime * .5) / 1.;', // Y distance from center - movement with speed over time

                'q.x += iMouseX;', // Y distance from center - movement with speed over time
                'q.y += iMouseY;', // Y distance from center - movement with speed over time

                'float len = length(q);',

                'float a = atan( q.y, q.x ) / 3.1416  ;',  //speed of rotation
                'float b = atan( q.y, q.x ) / 3.1416  ;', //speed of rotation
                'float c = atan( q.y, q.x ) / 13.1416  ;', //speed of rotation
                'float r1 = ((0.1+iProgress)*iWaves) / len + iTime;', // remove the / for reverse whirlpool
                'float r2 = ((0.1)*iWaves) / len + iTime ;',
                // 'float r1 = 0.3 / len + iTime * 0.5;',
                // 'float r2 = 0.5 / len + iTime * 0.5;',

                'float m = (cos(.5 ) + sin(.9)) / .5 ;',

                'vec4 tex1 = texture2D(iText0, vec2( a, r1 ));', // remove a to remove slice
                'vec4 tex2 = texture2D(iText1, vec2( b, r2 ));',// remove b to remove slice

                // 'vec4 tex1 = texture2D(iText0, vec2(a + 0.1 / len, r1 ));',
                // 'vec4 tex2 = texture2D(iText1, vec2(b + 0.1 / len, r2 ));',

                'vec3 col = vec3(mix(tex1, tex2, m));',
                // 'vec3 col = vec3(mix(col, tex3, m));',
                // 'vec3 col = vec3(tex1));',
                'vec3 d = col * len * 0.5 * iBrightness;',
                'gl_FragColor = vec4(d, 1.0);',
                '}',
            ].join("\n")
        }

        // const texture = await ExpoTHREE.loadAsync(someRemoteUrl);
        const backgroundGeometry = new THREE.PlaneGeometry(3, 5);

        var tuniform = {
            iTime: { type: 'f', value: 1 },
            iProgress: { type: 'f', value: 1 },
            iText0: { type: 't', value: texture },
            iText1: { type: 't', value: texture },
            iBrightness: { type: 'f', value: 1 },
            iMouseX: { type: 'f', value: -1/500 },
            iMouseY: { type: 'f', value: -1/500 },
            iWaves: { type: 'f', value: 1 }
        };

        tuniform.iText0.value.wrapS = tuniform.iText0.value.wrapT = THREE.RepeatWrapping;
        tuniform.iText1.value.wrapS = tuniform.iText1.value.wrapT = THREE.RepeatWrapping;

        const backgroundMaterial = new THREE.ShaderMaterial({
            uniforms: tuniform,
            vertexShader: this.shader.vertexShader,
            fragmentShader: this.shader.fragmentShader,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);

        this.shaderMat = backgroundMaterial;
        this.pulse = 0;
        this.speed = 3;
        this.progress = 1;
        this.superName = "SpinShader";
        this.textPosition = { x: -1, y: -1 }
    }

    getMesh() {
        return this.mesh;
    }

    setSpeed(speed, textPosition, progress) {
        this.speed = speed;
        this.textPosition = textPosition;
        this.progress = progress / 1000;
    }

    update(time, mouseX, mouseY) {
        const newTime = time
        // const newSpeed = this.speed * newTime
        // const newProgress = this.progress * newTime
        this.shaderMat.uniforms["iTime"].value = newTime;
        // this.shaderMat.uniforms["iProgress"].value = this.progress;
        // this.shaderMat.uniforms['iWaves'].value = this.speed;
        // this.shaderMat.uniforms['iMouseX'].value = this.textPosition.x / 500;
        // this.shaderMat.uniforms['iMouseY'].value = this.textPosition.y / 500;
        this.mesh.position.z = 0;
    }
}