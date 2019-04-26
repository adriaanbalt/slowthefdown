import { THREE } from "expo-three"
import { PrefabBufferGeometry, Utils } from "three-bas"

export default class ParticlePrefabGeometry extends PrefabBufferGeometry {

    // override THREE.BAS.PrefabBufferGeometry.bufferPosition
    // instead of simply copying the prefab, a random scale and rotation is applied
    bufferPositions() {
      var positionBuffer = this.createAttribute('position', 3).array

      var axis = new THREE.Vector3()
      var scaleMatrix = new THREE.Matrix4()
      var rotationMatrix = new THREE.Matrix4()
      var transformMatrix = new THREE.Matrix4()
      var p = new THREE.Vector3()

      // for each prefab, compute a random transformation
      for (var i = 0, offset = 0; i < this.prefabCount; i++) {
        // random scale
        scaleMatrix.identity().makeScale(Math.random(), Math.random(), Math.random())

        // random axis rotation
        Utils.randomAxis(axis)
        rotationMatrix.identity().makeRotationAxis(axis, Math.random() * Math.PI * 2)

        // mush the two matrices together
        transformMatrix.multiplyMatrices(scaleMatrix, rotationMatrix)

        // for each prefab vertex, apply the transformation matrix
        for (var j = 0; j < this.prefabVertexCount; j++, offset += 3) {
          var prefabVertex = this.prefabGeometry.vertices[j]

          p.copy(prefabVertex)
          p.applyMatrix4(transformMatrix)

          positionBuffer[offset] = p.x
          positionBuffer[offset + 1] = p.y
          positionBuffer[offset + 2] = p.z
        }
      }
      super.bufferPositions()
    }
    
}