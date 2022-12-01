import { App } from "@bigby/core"
import * as THREE from "three"

export const ThreePlugin = (app: App) =>
  app.addStartupSystem((app) => {
    console.log("Initializing Three.js!")

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 10

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    scene.add(
      new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      )
    )

    /* Render loop */
    app.addSystem((dt) => {
      renderer.render(scene, camera)
    })
  })
