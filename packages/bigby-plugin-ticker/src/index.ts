import { App, System } from "@bigby/core"
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
      app.onEarlyUpdateCallbacks.emit(dt)
      app.onFixedUpdateCallbacks.emit(dt)
      app.onUpdateCallbacks.emit(dt)
      app.onLateUpdateCallbacks.emit(dt)
      app.onRenderCallbacks.emit(dt)
    }

    animate()

    app.onStop(() => {
      running = false
    })
  })
