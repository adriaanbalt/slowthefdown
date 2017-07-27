import THREE from 'three';

export default class SpinShader extends THREE.Mesh{

	constructor( geo, mat ){
		super( geo, mat );
		this.shaderMat = mat;
		this.pulse = 0;
		this.speed = 1;
		this.progress = 0;
		this.superName = "SpinShader";
		this.textPosition = {x:-1,y:-1}
	}

	setSpeed( speed, textPosition, progress ) {
		this.speed = speed;
		this.textPosition = textPosition;
		this.progress = progress/1000;
	}

	update( time, mouseX, mouseY ) {
		// console.log ( 'this.progress', this.progress )
		this.shaderMat.uniforms['iTime'].value = time;
		this.shaderMat.uniforms['iProgress'].value = this.progress;
		this.shaderMat.uniforms['iSpeed'].value = this.speed;
		this.shaderMat.uniforms['iMouseX'].value = this.textPosition.x/500;
		this.shaderMat.uniforms['iMouseY'].value = this.textPosition.y/500;
		this.position.z = 0;
	}
}