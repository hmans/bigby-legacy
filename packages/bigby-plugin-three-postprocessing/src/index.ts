import { App } from "@bigby/core"
import { ThreePluginState } from "@bigby/plugin-three"
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  SMAAEffect,
  ToneMappingEffect,
  ToneMappingMode
} from "postprocessing"
import * as THREE from "three"

export const ThreePostprocessingPlugin = (app: App) => {
  /* Make sure the Three.js plugin is loaded */
  app.requireComponent(ThreePluginState)

  const cameraQuery = app.query([THREE.Camera])

  /* When the application starts, disable the Three.js plugin's render loop
  so we can instead implement our own */
  app.onStart(() => {
    const three = app.getSingletonComponent(ThreePluginState)

    if (!three)
      throw new Error("Couldn't find any entity with ThreePluginState")

    three.render = false

    const composer = new EffectComposer(three.renderer, {
      frameBufferType: THREE.HalfFloatType
    })

    cameraQuery.onEntityAdded.add((entity) => {
      composer.reset()
      const camera = entity.get(THREE.Camera)!

      composer.addPass(new RenderPass(three.scene, camera))
      composer.addPass(
        new EffectPass(
          camera,
          new BloomEffect({
            mipmapBlur: true,
            luminanceThreshold: 0.8,
            intensity: 5
          })
        )
      )

      composer.addPass(
        new EffectPass(
          camera,
          new ToneMappingEffect({ mode: ToneMappingMode.ACES_FILMIC })
        ),
        new SMAAEffect()
      )
    })

    app.onRender(() => {
      composer.render()
    })
  })

  return app
}
