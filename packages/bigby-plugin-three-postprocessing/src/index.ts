import { App, Stage, System } from "@bigby/core"
import { ThreeSystem } from "@bigby/plugin-three"
import {
  BlendFunction,
  BloomEffect,
  EffectComposer,
  EffectPass,
  NoiseEffect,
  RenderPass,
  SMAAEffect,
  ToneMappingEffect,
  ToneMappingMode
} from "postprocessing"
import * as THREE from "three"

export class ThreePostProcessing extends System {
  composer?: EffectComposer

  cameraQuery = this.app.query([THREE.Camera])

  start(): void {
    const three = this.app.getSingletonComponent(ThreeSystem)

    if (!three)
      throw new Error("Couldn't find any entity with ThreePluginState")

    three.render = false

    this.composer = new EffectComposer(three.renderer, {
      frameBufferType: THREE.HalfFloatType
    })

    this.cameraQuery.onEntityAdded.add((entity) => {
      this.composer!.reset()
      const camera = entity.get(THREE.Camera)!

      this.composer!.addPass(new RenderPass(three.scene, camera))

      this.composer!.addPass(
        new EffectPass(
          camera,
          new BloomEffect({
            mipmapBlur: true,
            luminanceThreshold: 1,
            intensity: 2
          })
        )
      )

      const effect = new NoiseEffect({
        blendFunction: BlendFunction.COLOR_DODGE
      })
      effect.blendMode.opacity.value = 0.045

      this.composer!.addPass(
        new EffectPass(
          camera,
          new ToneMappingEffect({ mode: ToneMappingMode.REINHARD2_ADAPTIVE }),
          new SMAAEffect(),
          effect
        )
      )
    })
  }

  run(dt: number): void {
    this.composer?.render()
  }

  onResize(): void {
    this.composer?.setSize(window.innerWidth, window.innerHeight)
  }
}

export function ThreePostprocessingPlugin(app: App) {
  app.addSystem(ThreePostProcessing, Stage.Render)
}
