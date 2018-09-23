import React from "react";
import ExpoTHREE, { THREE } from "expo-three"; // 3.0.0-alpha.4
import SimplexNoise from 'simplex-noise';

export default class MovingLetter extends React.Component {

    constructor() {
        super();

        this.simplex = new SimplexNoise(Math.random);

        let fontLoader = new THREE.FontLoader();
        fontLoader.load(
          "../assets/HelveticaNeueLTStd_Bold.json",
          response => {
            console.log("LOADED THE TEXT !!!!!!");
            const font = response;
            const mat = new THREE.MeshPhongMaterial({
              color: "#00FF00",
              // map: THREE.ImageUtils.loadTexture('assets/textures/uv.jpg'),
              shininess: 1
            });
            const geo = new THREE.TextGeometry("F", {
              font: font,
              size: 25,
              height: 100,
              curveSegments: 4,
              bevelThickness: 1,
              bevelSize: 0,
              bevelEnabled: true,
              material: 0,
              extrudeMaterial: 0
            });
            const fTxt = new THREE.Mesh(geo, mat);
            this.add(fTxt);
          }
        );

        let geometry = new THREE.CircleGeometry(.25, 10);
        let hitMaterial = new THREE.MeshBasicMaterial({
        //   color: 0xFF00FF,
          opacity: 1
        });
        this.mesh = new THREE.Mesh(geometry, hitMaterial);

        this.overProgress = 0;
        this.progress = 0;
        this.velocity = 0.005;
        // this.velocity = .04;// + .0001 * (1 - window.innerWidth/2000);
        this.radius = 1;
        this.noiseAccum = 0;
        this.speed = .15;
        this.isOver = false;
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
        this.mesh.material.color.setHex(0xff00ff);
    }

    out() {
        this.mesh.material.color.setHex(0xffffff);
    }
    

    getMesh() {
        // this.mesh.superName = 'MovingLetter'
        return this.mesh
    }

}
