import { App } from "./App"
import { NormalUpdate, UpdateStage } from "./UpdateStage"
import { System } from "./System"

export function SystemsPlugin(app: App) {
  app.registerComponent(System)
  app.registerComponent(UpdateStage)

  const systems = app.query([System])

  /* If a system is spawned without an update stage, assign it to the
  normal update. */
  systems.onEntityAdded((entity) => {
    if (!entity.get(UpdateStage)) {
      entity.add(NormalUpdate)
    }
  })
}
