import { App, System } from "@bigby/core"
import { clamp } from "@bigby/math"

export const AnimationFrameTicker = (app: App) =>
  app.onStart((app) => {
    let lastTime = performance.now()
    let running = true

    const systems = app.query([System])

    const animate = () => {
      if (running) requestAnimationFrame(animate)

      /* Calculate delta time */
      const time = performance.now()
      const dt = clamp((time - lastTime) / 1000, 0, 0.2)
      lastTime = time

      /* Update systems */
      for (const [_, system] of systems) {
        system.onEarlyUpdate?.(dt)
        system.onFixedUpdate?.(dt)
        system.onUpdate?.(dt)
        system.onLateUpdate?.(dt)
        system.onRender?.(dt)
      }
    }

    animate()

    app.onStop(() => {
      running = false
    })
  })
