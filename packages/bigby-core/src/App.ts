import { World } from "@maxiplex/core"
import { EventDispatcher } from "@maxiplex/event-dispatcher"
import * as Stage from "./Stage"
import { System } from "./System"

export type Plugin = (
  app: App
) => void | DisposeCallback | Promise<void | DisposeCallback>

export type DisposeCallback = (app: App) => void

export const DEFAULT_STAGES = [
  Stage.EarlyUpdate,
  Stage.FixedUpdate,
  Stage.Update,
  Stage.LateUpdate,
  Stage.Render
] as const

export class App extends World {
  protected registeredPlugins = new Set<Plugin>()

  protected onDispose = new EventDispatcher<App>()

  constructor() {
    super()
    console.log("🐝 Bigby Initializing")

    this.registerComponent(System)
    this.registerComponent(Stage.Stage)
  }

  async use(plugin: Plugin) {
    if (this.registeredPlugins.has(plugin)) return this
    this.registeredPlugins.add(plugin)

    /* Execute the system immediately */
    const result = await plugin(this)
    if (result) this.onDispose.add(result)

    return this
  }

  dispose() {
    console.log("⛔ Stopping App")

    /* Call all dispose callbacks */
    this.onDispose.emit(this)
    this.onDispose.clear()

    return this
  }
}
