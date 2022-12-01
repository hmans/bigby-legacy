import { App } from "@bigby/core"
import { clamp } from "@bigby/math"

export const TickerPlugin = (app: App) =>
  app.addStartupSystem((app) => {
    let lastTime = performance.now()

    const animate = () => {
      requestAnimationFrame(animate)

      /* Calculate delta time */
      const time = performance.now()
      const dt = clamp((time - lastTime) / 1000, 0, 0.2)
      lastTime = time

      /* Update systems */
      app.systems.forEach((system) => system(dt))
    }

    animate()
  })
