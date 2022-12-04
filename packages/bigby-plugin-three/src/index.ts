import { App, Transform3D } from "@bigby/core"
import * as THREE from "three"

class ThreePluginState {
  renderer = new THREE.WebGLRenderer({ antialias: true })
  scene = new THREE.Scene()
  camera?: THREE.Camera
}

export const ThreePlugin = (app: App) => {
  app.requireComponent(Transform3D)
  app.registerComponent(THREE.Object3D)
  app.registerComponent(THREE.Camera)
  app.registerComponent(ThreePluginState)

  const comp = new ThreePluginState()
  app.add([comp])

  const { renderer, scene } = comp

  /* Renderer & Canvas */
  app.onStart((app) => {
    /* Create our renderer */
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
  })

  app.onStop(() => {
    console.debug("Disposing renderer")
    document.body.removeChild(renderer.domElement)
    renderer.dispose()
    renderer.forceContextLoss()
  })

  /* Scene Objects */
  app.onStart((app) => {
    /* Query the world for Three.js scene objects */
    const sceneObjects = app.query([Transform3D, THREE.Object3D])

    /* When an entity with a scene object appears, add it to the Three.js scene */
    sceneObjects.onEntityAdded.add((entity) => {
      scene.add(entity.get(THREE.Object3D)!)
    })

    /* When an entity with a scene object disappears, remove it from the Three.js scene */
    sceneObjects.onEntityRemoved.add((entity) => {
      scene.remove(entity.get(THREE.Object3D)!)
    })

    /* Every frame, copy the transform data over to the Three.js objects */
    app.onUpdate(() => {
      for (const [
        _,
        { position, quaternion, scale },
        object3d
      ] of sceneObjects) {
        object3d.position.set(position[0], position[1], position[2])
        object3d.quaternion.set(
          quaternion[0],
          quaternion[1],
          quaternion[2],
          quaternion[3]
        )
        object3d.scale.set(scale[0], scale[1], scale[2])
      }
    })
  })

  /* Camera & Rendering */
  app.onStart((app) => {
    let activeCamera: THREE.Camera | undefined
    const cameras = app.query([THREE.Camera])

    /* When a new camera appears, register it as the main camera */
    cameras.onEntityAdded.add((entity) => {
      activeCamera = entity.get(THREE.Camera)
    })

    /* When a camera disappears and it's our active camera, disable it */
    cameras.onEntityRemoved.add((entity) => {
      if (entity.get(THREE.Camera) === activeCamera) activeCamera = undefined
    })

    /* Render every frame using the active camera if we have one */
    app.onRender(() => {
      if (activeCamera) renderer.render(scene, activeCamera)
    })

    /* Resize the renderer when the window resizes */
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)

      if (activeCamera instanceof THREE.PerspectiveCamera) {
        activeCamera.aspect = window.innerWidth / window.innerHeight
        activeCamera.updateProjectionMatrix()
      } else if (activeCamera instanceof THREE.OrthographicCamera) {
        activeCamera.left = -window.innerWidth / 2
        activeCamera.right = window.innerWidth / 2
        activeCamera.top = window.innerHeight / 2
        activeCamera.bottom = -window.innerHeight / 2
        activeCamera.updateProjectionMatrix()
      }
    }

    window.addEventListener("resize", onResize)

    app.onStop(() => {
      window.removeEventListener("resize", onResize)
    })
  })

  return app
}
