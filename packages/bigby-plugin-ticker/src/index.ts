import { App, DEFAULT_STAGES } from "@bigby/core"
import { clamp } from "@bigby/math"

export const AnimationFrameTicker = (app: App) =>
  app.onStart((app) => {
    let lastTime = performance.now()
    let running = true

    const animate = () => {
      if (running) requestAnimationFrame(animate)

      /* Calculate delta time */
      const time = performance.now()
      const dt = clamp((time - lastTime) / 1000, 0, 0.2)
      lastTime = time

      /* Invoke app update callbacks */
      for (const stage of DEFAULT_STAGES) {
        app[stage].emit(dt)
      }
    }

    animate()

    app.onStop(() => {
      running = false
    })
  })
