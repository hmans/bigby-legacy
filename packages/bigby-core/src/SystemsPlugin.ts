import { App, DEFAULT_STAGES } from "./App"
import { System } from "./System"

export function SystemsPlugin(app: App) {
  app.registerComponent(System)

  app.onStart((app) => {
    const systems = app.query([System])

    /* Invoke all systems' onStart methods */
    systems.onEntityAdded.add((entity) => {
      const system = entity.get(System)!
      system.onStart?.()
    })

    /* Invoke all systems' onStop methods */
    app.onStop(() => {
      for (const [_, system] of systems) system.onStop?.()
    })

    for (const stage of DEFAULT_STAGES) {
      const callback = (dt: number) => {
        for (const [_, system] of systems) system[stage]?.(dt)
      }

      app[stage].add(callback)

      app.onStop(() => {
        app[stage].remove(callback)
      })
    }
  })
}
