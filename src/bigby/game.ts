import * as THREE from "three"

export class Game {
  renderer = new THREE.WebGLRenderer()
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  start() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)
    this.camera.position.z = 5
  }

  stop() {
    document.body.removeChild(this.renderer.domElement)
  }

  update() {
    this.renderer.render(this.scene, this.camera)
  }
}
