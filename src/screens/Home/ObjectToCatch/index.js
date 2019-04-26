import { FileSystem, Asset } from "expo"
import React from "react"
import ExpoTHREE, { THREE } from "expo-three" // 3.0.0-alpha.4
import SimplexNoise from 'simplex-noise'
import TextMesh from './TextMesh'
import SVGLoader from "./SVGLoader";

export default class MovingLetter extends React.Component {

    constructor( font ) {
        super()

        this.fontData = font

        // console.log( "moving letter constructor", this.fontData, typeof this.fontData )

        this.setup()
    }

    async setup () {
        this.simplex = new SimplexNoise(Math.random)
        
        let geometry = new THREE.CircleGeometry(3, 20)
        let hitMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            opacity: 0.0,
            transparent: true
        })
        const hit = new THREE.Mesh(geometry, hitMaterial)
        hit.position.set(1.5,2,0)
        // hit.position.z = 10
        
        //create a group and add the two cubes
        //These cubes can now be rotated / scaled etc as a group
        this.mesh = new THREE.Group()
        
        this.overProgress = 1
        this.progress = 0
        this.velocity = .005
        // this.velocity = .04// + .0001 * (1 - window.innerWidth/2000)
        this.radius = 9
        this.noiseAccum = 0
        this.speed = 5
        this.isOver = false

        // light
        this.light = new THREE.AmbientLight(0xFFFFFF)
        // this.light.position.set(0, 2, 0)
        this.mesh.add(this.light)
        
        // SVG mesh
        // const svg = await this._loadSVGMesh()
        // svg.translateX(5)
        // svg.translateY(0)
        // svg.translateZ(-150)

        // this.loadThreeSVG();

        // this.mesh.add(svg)
        
        this.mesh.add(hit)
        this.createText("F");

        // this.generateTextGeometry('F', {
        //     size: 40,
        //     height: 12,
        //     font: this.fontData,
        //     weight: 'bold',
        //     style: 'normal',
        //     curveSegments: 24,
        //     bevelSize: 2,
        //     bevelThickness: 2,
        //     bevelEnabled: true,
        //     anchor: {
        //         x: 0.5,
        //         y: 0.5,
        //         z: 0.0
        //     }
        // });

        // this.createTextFontLoader( "F" )
    }

    // this one works
    createText = text => {
        // console.log( 'this.fontData', this.fontData)
        const textGeo = new THREE.TextBufferGeometry(text, {
            font: this.fontData,
            size: 4,
            height: 1,
            bevelThickness: 1,
            bevelSize: 1
        })

        // var size = textGeo.boundingBox.size();
        // var anchorX = size.x * -0.5;
        // var anchorY = size.y * -0.5;
        // var anchorZ = size.z * -0;
        // var matrix = new THREE.Matrix4().makeTranslation(anchorX, anchorY, anchorZ);
        // textGeo.applyMatrix(matrix);

        const materials = new THREE.MeshPhongMaterial({ color: 0xFFFFFF })
        const textMesh = new THREE.Mesh(textGeo, materials)
        textMesh.position.set( 0,0,0 )
        this.mesh.add(textMesh)

        // let centerOffset =
        //     -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x)
        // textMesh.position.x = centerOffset
    }

    update(time, mouseX, mouseY) {
        this.noise = this.simplex.noise2D(this.progress, 0)
        this.dx = (Math.cos((this.progress)) * (this.radius * (this.noise)))//  + (Math.sin( (time * (1 * this.speed) )) * 200)  // X distance from center - movement with speed
        this.dy = (Math.sin((this.progress)) * (this.radius * (this.noise)))//  + (Math.sin( (time * (1 * this.speed) )) * 200)  // Y distance from center - movement with speed over time
        this.mesh.position.x = this.dx
        this.mesh.position.y = this.dy

        // this.progress += this.velocity * this.speed / time
        // console.log("this.progress", this.progress, this.overProgress)
        this.progress += (this.velocity * this.speed * this.overProgress)
        // this.speed += (time / 1)
        // this.noiseAccum += 0.01 * this.noiseSpeed;
    }

    getPosition() {
        return this.mesh.position
    }

    setScale(scale) {
        this.scale.x = scale
        this.scale.y = scale
    }
    setVelocity(newVelocity) {
        this.velocity = newVelocity
    }
    setSpeed(newSpeed, isOver, overProgress) {
        this.speed = newSpeed
        this.isOver = isOver
        this.overProgress = overProgress
    }
    setNoiseSpeed(newSpeed) {
        this.noiseSpeed = newSpeed
    }
    setDepth(newZ) {
        this.mesh.position.z = newZ
    }
    setRadius(newRadius) {
        this.radius = newRadius
    }
    over(time) {
        this.speed = .5
        // to speed up while playing 
        this.overProgress = 1 //time / 10000
        // this.mesh.children[0].color.setHex(0xff00ff)
    }
    out() {
        this.speed = 5
        this.overProgress = 1
    }
    getMesh() {
        return this.mesh
    }


    // BELOW THIS NOTHING WORKS

    _loadSVGGeometry = async (svgAsset) => {
        await svgAsset.downloadAsync()
        const svgText = await FileSystem.readAsStringAsync(svgAsset.localUri)
        const loader = new SVGLoader()
        const shapePaths = loader.load(svgText)
        const geometry = new THREE.Geometry()
        for (let i = 0; i < shapePaths.length; i++) {
            const shapes = shapePaths[i].toShapes()
            for (let j = 0; j < shapes.length; j++) {
                geometry.merge(
                    new THREE.ExtrudeGeometry(shapes[j], {
                        bevelEnabled: false,
                        depth: 2,
                    })
                )
            }
        }
        return geometry
    }

    _loadSVGMesh = async() => {
        const svgAsset = await Asset.fromModule(require(`../../../assets/F.svg`))

        const geometry = await this._loadSVGGeometry(svgAsset)
        const material = new THREE.MeshBasicMaterial({ color: 0x00FF00 })
        const mesh = new THREE.Mesh(geometry, material)

        // // mesh.scale.x = -0.075
        // // mesh.scale.y = -1
        // mesh.scale.z = 0

        return mesh
    }

    loadThreeSVG = () => {
        // // instantiate a loader
        // var loader = new THREE.SVGLoader();

        // // load a SVG resource
        // loader.load(
        //     // resource URL
        //     '../../../assets/F.svg',
        //     // called when the resource is loaded
        //     function (data) {

        //         console.log( "svg ")

        //         var paths = data.paths;
        //         var group = new THREE.Group();

        //         for (var i = 0; i < paths.length; i++) {

        //             var path = paths[i];

        //             var material = new THREE.MeshBasicMaterial({
        //                 color: path.color,
        //                 side: THREE.DoubleSide,
        //                 depthWrite: false
        //             });

        //             var shapes = path.toShapes(true);

        //             for (var j = 0; j < shapes.length; j++) {

        //                 var shape = shapes[j];
        //                 var geometry = new THREE.ShapeBufferGeometry(shape);
        //                 var mesh = new THREE.Mesh(geometry, material);
        //                 group.add(mesh);

        //             }

        //         }

        //         this.mesh.add(group);

        //     },
        //     // called when loading is in progresses
        //     function (xhr) {

        //         console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        //     },
        //     // called when loading has errors
        //     function (error) {

        //         console.log('An error happened');

        //     }
        // );

        var loader = new THREE.SVGLoader();
        loader.load('../../../assets/tiger.svg', function (data) {
            console.log('load svg', data)
            var paths = data.paths;
            var group = new THREE.Group();
            group.scale.multiplyScalar(0.25);
            group.position.x = - 70;
            group.position.y = 70;
            group.scale.y *= - 1;
            for (var i = 0; i < paths.length; i++) {
                var path = paths[i];
                var fillColor = path.userData.style.fill;
                if (guiData.drawFillShapes && fillColor !== undefined && fillColor !== 'none') {
                    var material = new THREE.MeshBasicMaterial({
                        color: new THREE.Color().setStyle(fillColor),
                        opacity: path.userData.style.fillOpacity,
                        transparent: path.userData.style.fillOpacity < 1,
                        side: THREE.DoubleSide,
                        depthWrite: false,
                        wireframe: guiData.fillShapesWireframe
                    });
                    var shapes = path.toShapes(true);
                    for (var j = 0; j < shapes.length; j++) {
                        var shape = shapes[j];
                        var geometry = new THREE.ShapeBufferGeometry(shape);
                        var mesh = new THREE.Mesh(geometry, material);
                        group.add(mesh);
                    }
                }
                var strokeColor = path.userData.style.stroke;
                if (guiData.drawStrokes && strokeColor !== undefined && strokeColor !== 'none') {
                    var material = new THREE.MeshBasicMaterial({
                        color: new THREE.Color().setStyle(strokeColor),
                        opacity: path.userData.style.strokeOpacity,
                        transparent: path.userData.style.strokeOpacity < 1,
                        side: THREE.DoubleSide,
                        depthWrite: false,
                        wireframe: guiData.strokesWireframe
                    });
                    for (var j = 0, jl = path.subPaths.length; j < jl; j++) {
                        subPath = path.subPaths[j];
                        var geometry = THREE.SVGLoader.pointsToStroke(subPath.getPoints(), path.userData.style);
                        if (geometry) {
                            var mesh = new THREE.Mesh(geometry, material);
                            group.add(mesh);
                        }
                    }
                }
            }
            this.mesh.add(group);
        },
        // called when loading is in progresses
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },
        // called when loading has errors
        function (error) {

            console.log('An error happened');

        })
    }

    createTextFontLoader = async text => {
        const json = JSON.parse("../../../assets/fonts/neue_haas_unica_pro_medium.json"); // you have to parse the data so it becomes a JS object 
        var fontLoader = new THREE.FontLoader();
        const font = loader.parse(json);
        let shapes = font.generateShapes("F", 100, 2);
        this.mesh.add(shapes);
        // console.log('create text font loader', fontLoader)
        // await fontLoader.load("../../../assets/fonts/neue_haas_unica_pro_medium.json", function (font) {
        //     console.log ( "FONT LOADER LOADED", font)
        //     var textGeo = new THREE.TextGeometry(text, {
        //         size: 10,
        //         height: 5,
        //         curveSegments: 6,
        //         font
        //     });
        //     var color = new THREE.Color();
        //     color.setRGB(255, 250, 250);
        //     var textMaterial = new THREE.MeshBasicMaterial({ color: color });
        //     var text = new THREE.Mesh(textGeo, textMaterial);
        //     this.mesh.add(text);
        // })
    }

    loadFont = async () => {
        try {
            let t = await Font.loadAsync({
                helvetica: require("../../../assets/fonts/HelveticaNeueLTStd-Bd.ttf")
            });
        } catch (e) {
            Log.error(e);
        } finally {
            // console.log("Font.isLoaded", Font.isLoaded("helvetica"), Font)
            let t = Font.processFontFamily("helvetica");
            // console.log('t', t)
        }
    };

    createTextPlugin = text => {
        const textMesh = new TextMesh();
        this.mesh.add(textMesh);
        textMesh.material = new THREE.MeshPhongMaterial({ color: 0x056ecf });
        textMesh.update({
            text: text,
            font: this.fontData, // This accepts json, THREE.Font, or a uri to remote THREE.Font json
            size: 10, //Size of the text. Default is 100.
            height: 5, //Thickness to extrude text. Default is 50.
            curveSegments: 12, // — Integer. Number of points on the curves. Default is 12.
            bevelEnabled: false, // — Boolean. Turn on bevel. Default is False.
            bevelThickness: 1, // — Float. How deep into text bevel goes. Default is 10.
            bevelSize: 0.8, // — Float. How far from text outline is bevel. Default is 8.
            bevelSegments: 0.3 // — Integer. Number of bevel segments. Default is 3.
        });

    }

    colorAnim(ori, dest, prog) {
        var casergb
        function toArr(s) {
            if (s.charAt(0) !== 'r') {
                if (s.charAt(0) === '#') { s = s.slice(1) }
                if (s.length === 3) { s = ''.concat(s[0], s[0], s[1], s[1], s[2], s[2]) }
                var hex = parseInt(s, 16)
                return [hex >> 16, hex >> 8 & 0xFF, hex & 0xFF]
            } else {
                casergb = s.slice(0, s.indexOf('('))
                return s.match(/[\d]+/g).map(function (n) { return parseInt(n, 10) })
            }
        }
        var cori = toArr(ori)
        var cdest = toArr(dest)
        var cnow = []
        for (var i = 0; i < 3; i++) {
            cnow.push((cori[i] + (cdest[i] - cori[i]) * prog) | 0)
        }
        if (casergb) {
            if (casergb.length === 3) {
                return casergb.concat('(', cnow[0], ',', cnow[1], ',', cnow[2], ')')
            } else {
                return casergb.concat('(', cnow[0], ',', cnow[1], ',', cnow[2], ',', cdest[3], ')')
            }
        } else {
            return (0x1000000 | (cnow[0] << 16) | (cnow[1] << 8) | cnow[2]).toString(16).slice(1)
        }
    }

    generateTextGeometry(text, params) {
        var geometry = new THREE.TextGeometry(text, params);

        geometry.computeBoundingBox();

        var size = geometry.boundingBox.size();
        var anchorX = size.x * -params.anchor.x;
        var anchorY = size.y * -params.anchor.y;
        var anchorZ = size.z * -params.anchor.z;
        var matrix = new THREE.Matrix4().makeTranslation(anchorX, anchorY, anchorZ);

        geometry.applyMatrix(matrix);

        const materials = new THREE.MeshPhongMaterial({ color: 0xFFFFFF })
        const textMesh = new THREE.Mesh(geometry, materials)
        textMesh.position.set(0, 0, 0)
        this.mesh.add(textMesh)
    }

}
