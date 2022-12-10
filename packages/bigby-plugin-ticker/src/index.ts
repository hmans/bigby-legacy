import {
  App,
  Constructor,
  EarlyUpdate,
  FixedUpdate,
  LateUpdate,
  NormalUpdate,
  RenderUpdate,
  System,
  UpdateStage
} from "@bigby/core"
import { clamp } from "@bigby/math"

export const DEFAULT_STAGES = [
  EarlyUpdate,
  FixedUpdate,
  NormalUpdate,
  LateUpdate,
  RenderUpdate
]

export const TickerPlugin =
  (stages: Constructor<UpdateStage>[] = DEFAULT_STAGES) =>
  (app: App) =>
    app.onStart((app) => {
      let lastTime = performance.now()
      let running = true

      const queries = stages.map((stage) => app.query([System, stage]))

      const animate = () => {
        if (running) requestAnimationFrame(animate)

        /* Calculate delta time */
        const time = performance.now()
        const dt = clamp((time - lastTime) / 1000, 0, 0.2)
        lastTime = time

        /* Update systems */
        for (const query of queries) {
          for (const [_, system] of query) {
            system.tick(dt)
          }
        }
      }

      animate()

      app.onStop(() => {
        running = false
      })
    })
