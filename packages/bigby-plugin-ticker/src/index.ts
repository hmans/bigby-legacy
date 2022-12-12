import { App, DEFAULT_STAGES, System } from "@bigby/core"
import { clamp } from "@bigby/math"

export class AnimationFrameTickerSystem extends System {
  running = false

  onStart() {
    this.running = true
    let lastTime = performance.now()

    const systems = this.app.query([System])

    const animate = () => {
      if (this.running) requestAnimationFrame(animate)

      /* Calculate delta time */
      const time = performance.now()
      const dt = clamp((time - lastTime) / 1000, 0, 0.2)
      lastTime = time

      /* Invoke app update callbacks */
      for (const stage of DEFAULT_STAGES) {
        for (const [_, system] of systems) {
          system[stage]?.(dt)
        }
      }
    }

    animate()
  }

  onStop() {
    this.running = false
  }
}

export function AnimationFrameTicker(app: App) {
  app.addSystem(AnimationFrameTickerSystem)
}
