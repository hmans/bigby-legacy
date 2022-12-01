import { App, Transform } from "@bigby/core"
import * as THREE from "three"

export const ThreePlugin = (app: App) =>
  app.addStartupSystem((app) => {
    const scene = new THREE.Scene()

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    const sceneObjects = app.world.query([Transform, THREE.Object3D])

    sceneObjects.onEntityAdded.add((entity) => {
      scene.add(entity.get(THREE.Object3D))
    })

    sceneObjects.onEntityRemoved.add((entity) => {
      scene.remove(entity.get(THREE.Object3D))
    })

    /* System that copies transforms over to scene objects */
    app.addSystem(() => {
      sceneObjects.iterate((_, [{ position, quaternion, scale }, object3d]) => {
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

    /* When a new camera appears, register it as the main camera */
    let activeCamera: THREE.Camera | undefined
    const cameras = app.world.query([THREE.Camera])
    cameras.onEntityAdded.add((entity) => {
      activeCamera = entity.get(THREE.Camera)
    })

    /* Render loop */
    app.addSystem(() => {
      if (activeCamera) renderer.render(scene, activeCamera)
    })
  })
