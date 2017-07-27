'use strict';

import PIXI from 'pixi.js';

export default class Vec2 extends PIXI.Point {

    constructor( x, y ){
        super( x, y );
        this.x = x || 0.0;
        this.y = y || 0.0;
    }

    add( vec ){
        this.x += vec.x;
        this.y += vec.y;
    }

    sub( vec ){
        this.x -= vec.x;
        this.y -= vec.y;
    }

    mult( n ){
        this.x *= n;
        this.y *= n;
    }

    div( n ){
        this.x /= n;
        this.y /= n;
    }

    mag() {
        var mag = Math.sqrt( this.x * this.x + this.y * this.y );
        return mag;
    }

    normalize() {
        var m = this.mag();
         if ( m > 0 ) {
           this.div( m );
         }
    }

    limit( max ) {
        if( this.mag() > max ) {
          this.normalize();
          this.mult( max );
        }
    }

    get(){
        return _.clone( this );
    }

    sub(v1, v2) {
        return new Vec2(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    div (v, scaler){
        var vec2 = new Vec2( v.x, v.y );
        vec2.div( scaler );
        return vec2;
    }
}