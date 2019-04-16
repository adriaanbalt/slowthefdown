export default class THREERoot {

  constructor(params) {
    // defaults
    this.params = Object.assign(
      {
        container: "#three-container",
        fov: 60,
        zNear: 1,
        zFar: 10000,
        createCameraControls: false,
        autoStart: true,
        pixelRatio: window.devicePixelRatio,
        antialias: window.devicePixelRatio === 1,
        alpha: false
      },
      params
    )

    // maps and arrays
    this.updateCallbacks = []
    this.resizeCallbacks = []
    this.objects = {}

    // renderer
    if ( this.params.renderer ) {
      this.renderer = this.params.renderer
    }
    else {
      this.renderer = new THREE.WebGLRenderer({
          antialias: this.params.antialias,
          alpha: this.params.alpha
      })
      this.renderer.setPixelRatio(this.params.pixelRatio)
    }

    // camera
    this.camera = new THREE.PerspectiveCamera(
      this.params.fov,
      this.params.width / this.params.height,
      this.params.zNear,
      this.params.zFar
    )

    // scene
    this.scene = new THREE.Scene()

    // resize handling
    this.resize = this.resize.bind(this)
    this.resize()

    // tick / update / render
    this.tick = this.tick.bind(this)
    this.params.autoStart && this.tick()

    this.params.createCameraControls && this.createOrbitControls()
  }

  createOrbitControls() {
    this.controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    )
    this.addUpdateCallback(this.controls.update.bind(this.controls))
  }
  start() {
    this.tick()
  }
  addUpdateCallback(callback) {
    this.updateCallbacks.push(callback)
  }
  addResizeCallback(callback) {
    this.resizeCallbacks.push(callback)
  }
  add(object, key) {
    key && (this.objects[key] = object)
    this.scene.add(object)
  }
  addTo(object, parentKey, key) {
    key && (this.objects[key] = object)
    this.get(parentKey).add(object)
  }
  get(key) {
    return this.objects[key]
  }
  remove(o) {
    var object

    if (typeof o === "string") {
      object = this.objects[o]
    } else {
      object = o
    }

    if (object) {
      object.parent.remove(object)
      delete this.objects[o]
    }
  }
  tick() {
    this.update()
    this.render()
    requestAnimationFrame(this.tick)
  }
  update() {
    this.updateCallbacks.forEach(function(callback) {
      callback()
    })
  }
  render() {
    this.renderer.render(this.scene, this.camera)
  }
  resize() {
    var width = this.params.width
    var height = this.params.height

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(width, height)
    this.resizeCallbacks.forEach(function(callback) {
      callback()
    })
  }
  initPostProcessing(passes) {
    var size = this.renderer.getSize()
    var pixelRatio = this.renderer.getPixelRatio()
    size.width *= pixelRatio
    size.height *= pixelRatio

    var composer = (this.composer = new THREE.EffectComposer(
      this.renderer,
      new THREE.WebGLRenderTarget(size.width, size.height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        stencilBuffer: false
      })
    ))

    var renderPass = new THREE.RenderPass(this.scene, this.camera)
    this.composer.addPass(renderPass)

    for (var i = 0; i < passes.length; i++) {
      var pass = passes[i]
      pass.renderToScreen = i === passes.length - 1
      this.composer.addPass(pass)
    }

    this.renderer.autoClear = false
    this.render = function() {
      this.renderer.clear()
      this.composer.render()
    }.bind(this)

    this.addResizeCallback(
      function() {
        var width = this.params.width
        var height = this.params.height

        composer.setSize(width * pixelRatio, height * pixelRatio)
      }.bind(this)
    )
  }
}
