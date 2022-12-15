import { App, System } from "@bigby/core"
import { DEFAULT_STAGES } from "@bigby/core/src/Stage"
import { clamp } from "@bigby/math"

export function AnimationFrameTicker(app: App) {
  let running = false

  running = true
  let lastTime = performance.now()

  const systemQueries = DEFAULT_STAGES.map((stage) =>
    app.systems.query([System, stage])
  )

  const animate = () => {
    if (running) requestAnimationFrame(animate)

    /* Calculate delta time */
    const time = performance.now()
    const dt = clamp((time - lastTime) / 1000, 0, 0.2)
    lastTime = time

    /* Invoke app update callbacks */
    for (const query of systemQueries) {
      for (const [_, system] of query) {
        if (system.run && system.state === "running") {
          system.run(dt)
        }
      }
    }
  }

  animate()

  return () => {
    running = false
  }
}
