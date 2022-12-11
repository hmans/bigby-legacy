import { App } from "./App"
import { System } from "./System"

export function SystemsPlugin(app: App) {
  app.registerComponent(System)
  const systems = app.query([System])
}
