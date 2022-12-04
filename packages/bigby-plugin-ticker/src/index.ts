import { App } from "@bigby/core"
import { clamp } from "@bigby/math"

export const TickerPlugin = (app: App) => {
  return app.onStart((app) => {
    /* Add system that invokes our own callbacks */
    app.onTick((dt) => {
      app.onEarlyUpdateCallbacks.emit(dt)
      app.onLateUpdateCallbacks.emit(dt)
      app.onUpdateCallbacks.emit(dt)
      app.onRenderCallbacks.emit(dt)
    })

    let lastTime = performance.now()
    let running = true

    const animate = () => {
      if (running) requestAnimationFrame(animate)

      /* Calculate delta time */
      const time = performance.now()
      const dt = clamp((time - lastTime) / 1000, 0, 0.2)
      lastTime = time

      /* Update systems */
      app.onTickCallbacks.emit(dt)
    }

    animate()

    app.onStop(() => {
      running = false
    })
  })
}
