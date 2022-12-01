import { App, Transform } from "@bigby/core"
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

    const meshes = app.world.query([Transform, THREE.Object3D])

    meshes.onEntityAdded.add((entity) => {
      scene.add(entity.get(THREE.Object3D))
    })

    meshes.onEntityRemoved.add((entity) => {
      scene.remove(entity.get(THREE.Object3D))
    })

    /* System that copies transforms over to scene objects */
    app.addSystem(() => {
      meshes.iterate((_, [{ position, quaternion, scale }, object3d]) => {
        object3d.position.set(position[0], position[1], position[2])
        object3d.quaternion.set(
          quaternion[0],
          quaternion[1],
          quaternion[2],
          quaternion[3]
        )
        object3d.scale.set(scale[0], scale[1], scale[2])
      })
    })

    /* Render loop */
    app.addSystem((dt) => {
      renderer.render(scene, camera)
    })
  })
