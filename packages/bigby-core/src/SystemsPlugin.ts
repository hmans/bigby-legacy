import { App } from "./App"
import { System } from "./System"

export function SystemsPlugin(app: App) {
  const systems = app.systems.query([System])

  /* Whenever a system is added, call its start method */
  systems.onEntityAdded.add((_, [system]) => {
    if (!system.start) {
      system.state = "running"
      return
    }

    system.state = "starting"
    const result = system.start()

    if (!(result instanceof Promise)) {
      system.state = "running"
      return
    }

    system.promise = result
    system.promise.then(() => {
      system.state = "running"
    })
  })

  /* Whenever a system is removed, call its dispose method */
  systems.onEntityRemoved.add((_, [system]) => {
    if (system.dispose) system.dispose()
    system.state = "stopped"
  })
}
