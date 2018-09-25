import { FileSystem, Asset } from "expo";
import React from "react";
import ExpoTHREE, { THREE } from "expo-three"; // 3.0.0-alpha.4
import SimplexNoise from 'simplex-noise';
import SVGLoader from '../lib/SVGLoader'

export default class MovingLetter extends React.Component {

    constructor() {
        super();
        this.setup();
    }

    async setup () {
        console.log("setup")
        this.simplex = new SimplexNoise(Math.random);

        
        let geometry = new THREE.CircleGeometry(.25, 10);
        let hitMaterial = new THREE.MeshBasicMaterial({
            //   color: 0xFF00FF,
            opacity: .5
        });
        const hit = new THREE.Mesh(geometry, hitMaterial);
        
        //create a group and add the two cubes
        //These cubes can now be rotated / scaled etc as a group
        this.mesh = new THREE.Group();
        
        this.overProgress = 0;
        this.progress = 0;
        this.velocity = 0.005;
        // this.velocity = .04;// + .0001 * (1 - window.innerWidth/2000);
        this.radius = 1;
        this.noiseAccum = 0;
        this.speed = .15;
        this.isOver = false;

        // light
        this.light = new THREE.PointLight(0xffffff, 2.0, 500);
        this.light.position.set(0, 5, 0);
        this.mesh.add(this.light);
        
        // SVG mesh
        const svg = await this._loadSVGMesh();
        svg.translateX(-38);
        svg.translateY(5);
        svg.translateZ(-200);
        console.log( 'svg', svg );

        // this.mesh.add(hit);
        this.mesh.add(svg)
    }

    async _loadSVGGeometry(svgAsset) {
        await svgAsset.downloadAsync();
        const svgText = await FileSystem.readAsStringAsync(svgAsset.localUri);
        const loader = new SVGLoader();
        const shapePaths = loader.load(svgText);
        const geometry = new THREE.Geometry();
        for (let i = 0; i < shapePaths.length; i++) {
            const shapes = shapePaths[i].toShapes();
            for (let j = 0; j < shapes.length; j++) {
                geometry.merge(
                    new THREE.ExtrudeGeometry(shapes[j], {
                        bevelEnabled: false,
                        amount: 2,
                    })
                );
            }
        }
        return geometry;
    }

    async _loadSVGMesh() {
        const svgAsset = await Asset.fromModule(require(`../assets/F.svg`));

        const geometry = await this._loadSVGGeometry(svgAsset);
        const material = new THREE.MeshPhongMaterial({ color: 0xff00ff });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.scale.x = 0.075;
        mesh.scale.y = 0.075;
        mesh.scale.z = 1;
        
        return mesh;
    }

    update(time, mouseX, mouseY, isOver = false ) {
        // console.log("time", time, this.progress )
        this.noise = this.simplex.noise2D(this.progress, 0);
        this.dx = (Math.cos((this.progress)) * (this.radius * (this.noise)));//  + (Math.sin( (time * (1 * this.speed) )) * 200) ; // X distance from center - movement with speed
        this.dy = (Math.sin((this.progress)) * (this.radius * (this.noise)));//  + (Math.sin( (time * (1 * this.speed) )) * 200) ; // Y distance from center - movement with speed over time
        this.mesh.position.x = this.dx;
        this.mesh.position.y = this.dy;

        // this.rotation.x += 0.1;
        // this.rotation.y += 0.1;
        // this.rotation.z += 0.1;
        this.progress += this.velocity * this.speed / time;
        this.noiseAccum += 0.01 * this.noiseSpeed;

        // if ( this.isOver ) {
        this.speed += time / 500;
        // }
    }

    colorAnim(ori, dest, prog) {
        var casergb;
        function toArr(s) {
            if (s.charAt(0) !== 'r') {
                if (s.charAt(0) === '#') { s = s.slice(1); }
                if (s.length === 3) { s = ''.concat(s[0], s[0], s[1], s[1], s[2], s[2]); }
                var hex = parseInt(s, 16);
                return [hex >> 16, hex >> 8 & 0xFF, hex & 0xFF];
            } else {
                casergb = s.slice(0, s.indexOf('('));
                return s.match(/[\d]+/g).map(function (n) { return parseInt(n, 10); });
            }
        }
        var cori = toArr(ori);
        var cdest = toArr(dest);
        var cnow = []
        for (var i = 0; i < 3; i++) {
            cnow.push((cori[i] + (cdest[i] - cori[i]) * prog) | 0);
        }
        if (casergb) {
            if (casergb.length === 3) {
                return casergb.concat('(', cnow[0], ',', cnow[1], ',', cnow[2], ')');
            } else {
                return casergb.concat('(', cnow[0], ',', cnow[1], ',', cnow[2], ',', cdest[3], ')');
            }
        } else {
            return (0x1000000 | (cnow[0] << 16) | (cnow[1] << 8) | cnow[2]).toString(16).slice(1);
        }
    }


    setScale(scale) {
        this.scale.x = scale;
        this.scale.y = scale;
    }

    setVelocity(newVelocity) {
        this.velocity = newVelocity;
    }

    setSpeed(newSpeed, isOver, overProgress) {
        this.speed = newSpeed;
        this.isOver = isOver;
        this.overProgress = overProgress;
    }

    setNoiseSpeed(newSpeed) {
        this.noiseSpeed = newSpeed;
    }

    setDepth(newZ) {
        this.mesh.position.z = newZ;
    }

    setRadius(newRadius) {
        this.radius = newRadius;
    }

    over() {
        // this.mesh.children[0].color.setHex(0xff00ff);
    }

    out() {
        // this.mesh.children[0].color.setHex(0xffffff);
    }
    

    getMesh() {
        // this.mesh.superName = 'MovingLetter'
        return this.mesh
    }

}
