/**
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 */

export default class Vector4 {

    constructor( x, y, z, w ) {

        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = ( w !== undefined ) ? w : 1;
    }

    set( x, y, z, w ) {

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        return this;

    }

    copy( v ) {

        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = ( v.w !== undefined ) ? v.w : 1;

    }

    clone() {

        return new Vector4( this.x, this.y, this.z, this.w );

    }


    add( v1, v2 ) {

        this.x = v1.x + v2.x;
        this.y = v1.y + v2.y;
        this.z = v1.z + v2.z;
        this.w = v1.w + v2.w;

        return this;

    }

    addSelf( v ) {

        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;

        return this;

    }

    sub( v1, v2 ) {

        this.x = v1.x - v2.x;
        this.y = v1.y - v2.y;
        this.z = v1.z - v2.z;
        this.w = v1.w - v2.w;

        return this;

    }

    subSelf( v ) {

        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        this.w -= v.w;

        return this;

    }

    multiplyScalar( s ) {

        this.x *= s;
        this.y *= s;
        this.z *= s;
        this.w *= s;

        return this;

    }

    divideScalar( s ) {

        if ( s ) {

            this.x /= s;
            this.y /= s;
            this.z /= s;
            this.w /= s;

        } else {

            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 1;

        }

        return this;

    }


    negate() {

        return this.multiplyScalar( -1 );

    }

    dot( v ) {

        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;

    }

    lengthSq() {

        return this.dot( this );

    }

    length() {

        return Math.sqrt( this.lengthSq() );

    }

    normalize() {

        return this.divideScalar( this.length() );

    }

    setLength( l ) {

        return this.normalize().multiplyScalar( l );

    }


    lerpSelf( v, alpha ) {

        this.x += ( v.x - this.x ) * alpha;
        this.y += ( v.y - this.y ) * alpha;
        this.z += ( v.z - this.z ) * alpha;
        this.w += ( v.w - this.w ) * alpha;

        return this;

    }

}