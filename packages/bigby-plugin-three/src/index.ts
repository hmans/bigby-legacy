import { App, RenderUpdate, System } from "@bigby/core"
import * as THREE from "three"

export * from "./helpers"

export class Parent3D {
  constructor(public parent: THREE.Object3D) {}
}

export class ThreePluginState {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera?: THREE.Camera
  render = true

  constructor({ render = true }: { render?: boolean } = {}) {
    this.render = render

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: false,
      stencil: false,
      depth: false
    })

    /* Configure Shadow Map */
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    /* Configure color space */
    THREE.ColorManagement.legacyMode = false
    this.renderer.outputEncoding = THREE.sRGBEncoding

    this.scene = new THREE.Scene()
  }
}

export const ThreePlugin = (app: App) => {
  app.registerComponent(THREE.Object3D)
  app.registerComponent(THREE.Camera)
  app.registerComponent(ThreePluginState)
  app.registerComponent(Parent3D)

  const state = new ThreePluginState()
  app.spawn([state])

  const { renderer, scene } = state

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
    const sceneObjects = app.query([THREE.Object3D])

    /* When an entity with a scene object appears, add it to the Three.js scene */
    sceneObjects.onEntityAdded((entity) => {
      const object3d = entity.get(THREE.Object3D)!
      scene.add(object3d)
    })

    /* When an entity with a scene object disappears, remove it from the Three.js scene */
    sceneObjects.onEntityRemoved((entity) => {
      scene.remove(entity.get(THREE.Object3D)!)
    })
  })

  /* Custom Parenting */
  app.onStart((app) => {
    const parentedQuery = app.query([Parent3D, THREE.Object3D])

    parentedQuery.onEntityAdded((entity) => {
      const parent = entity.get(Parent3D)!.parent
      const object = entity.get(THREE.Object3D)!
      parent.add(object)
    })

    parentedQuery.onEntityRemoved((entity) => {
      const parent = entity.get(Parent3D)!.parent
      const object = entity.get(THREE.Object3D)!
      parent.remove(object)
    })
  })

  /* Camera & Rendering */
  app.onStart((app) => {
    let activeCamera: THREE.Camera | undefined
    const cameras = app.query([THREE.Camera])

    /* When a new camera appears, register it as the main camera */
    cameras.onEntityAdded((entity) => {
      console.log("camera added", entity)
      activeCamera = entity.get(THREE.Camera)
    })

    /* When a camera disappears and it's our active camera, disable it */
    cameras.onEntityRemoved((entity) => {
      if (entity.get(THREE.Camera) === activeCamera) activeCamera = undefined
    })

    /* Render every frame using the active camera if we have one */
    app.spawn([
      new System(() => {
        console.log("hello", state.render, activeCamera)
        if (!state.render) return
        if (!activeCamera) return

        renderer.render(scene, activeCamera)
      }),

      new RenderUpdate()
    ])

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
