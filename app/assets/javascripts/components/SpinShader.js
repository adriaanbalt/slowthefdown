// REQUIREMENTS
import THREE from 'three';

export default class SpinShader extends THREE.Mesh{

	constructor( geo, mat ){
		super( geo, mat );
		this.shaderMat = mat;
		this.pulse = 0;
		// Custom vertex and fragement shader
		this.shape = new THREE.Mesh( geo, this.shaderMat );
	}

	update( time ) {
    	// console.log ( 'spin shader update', this.pulse );
		// if ( 0 < this.pulse && this.pulse < 15 ) {
		// 	console.log ( "inside space!" );
		// 	this.pulse += -0.1;
		// } else {
		// 	this.pulse -= 0.1;
		// }
		// this.pulse = THREE.Math.clamp( this.pulse, 0.0, 25.0 );
		// this.shaderMat.uniforms['iPulse'].value = this.pulse;
    	this.shaderMat.uniforms['iTime'].value = time;
	}
}

// 'void main() {',

// 	// 'vec2 uv = vUv;',
// 	// 'vec2 center = vec2(0.5);', //iResolution.xy * 0.5;',
// 	// 'float radius = 0.005 * iResolution.y;',

//  //    // Background layer
// 	// 'vec4 layer1 = vec4(rgb(210.0, 222.0, 228.0), 1.0);',
	
// 	// // Circle
// 	// 'vec3 red = rgb(225.0, 95.0, 60.0);',
// 	// 'vec4 layer2 = circle(uv, center, radius, red);',
	
// 	'vec2 p = gl_FragCoord.xy / iResolution.xy;',
// 	'vec2 q = p - vec2( 0.33, 0.8 );',

// 	'vec3 col = mix ( vec3( 1.0, 0.4, 0.1 ), vec3( 1.0, 0.8, 0.3 ), sqrt(p.y) );',

// 	'float r = 0.2 + 0.1 * cos( atan( q.y, q.x ) * 10.0 + 20.0 * q.x + 1.0 );',
// 	'col *= smoothstep( r, r+0.01, length( q ) );',

// 	'r = 0.01;',
// 	'r += 0.002 * cos( 120.0 * q.y );',
// 	'r += exp( -50.0 * p.y );',
// 	'col *= 1.0 - ( 1.0 - smoothstep( r, r+0.002, abs( q.x - 0.25*sin( 2.0 * q.y ) ) )) * ( 1.0 - smoothstep( 0.0, 0.01, (q.y)));',

// 	// Blend the two
// 	// 'gl_FragColor = mix(layer1, layer2, layer2.a);',
// 	'gl_FragColor = vec4(col,1.0);',
// '}',