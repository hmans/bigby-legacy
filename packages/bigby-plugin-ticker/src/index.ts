import { App, DEFAULT_STAGES, Stage, System } from "@bigby/core"
import { clamp } from "@bigby/math"

export function AnimationFrameTicker(app: App) {
  let running = false

  running = true
  let lastTime = performance.now()

  const systemQueries = DEFAULT_STAGES.map((stage) =>
    app.query([System, stage])
  )

  const animate = () => {
    if (running) requestAnimationFrame(animate)

    /* Calculate delta time */
    const time = performance.now()
    const dt = clamp((time - lastTime) / 1000, 0, 0.2)
    lastTime = time

    /* Invoke app update callbacks */
    for (const [_, system] of systemQueries) {
      // system.run(dt)
    }
  }

  animate()

  return () => {
    running = false
  }
}
