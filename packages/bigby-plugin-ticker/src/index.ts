import { App } from "@bigby/core"
import { clamp } from "@bigby/math"

let running = false

export const TickerPlugin = (app: App) => {
  console.log("TickerPlugin")

  return app.addStartupSystem((app) => {
    console.log("hello")

    let lastTime = performance.now()

    const animate = () => {
      if (running) requestAnimationFrame(animate)

      /* Calculate delta time */
      const time = performance.now()
      const dt = clamp((time - lastTime) / 1000, 0, 0.2)
      lastTime = time

      /* Update systems */
      app.systems.forEach((system) => system(dt))
    }

    if (!running) {
      running = true
      animate()
    }
  })
}
