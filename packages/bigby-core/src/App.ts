import { Query, World } from "@maxiplex/core"
import { EventDispatcher } from "@maxiplex/event-dispatcher"
import * as Stage from "./Stage"
import { System } from "./System"

export type Plugin = (
  app: App
) => void | DisposeCallback | Promise<void | DisposeCallback>

export type OnLoadCallback<A extends App> = (app: A) => void | Promise<void>
export type OnStartCallback<A extends App> = (app: A) => void | Promise<void>
export type OnStopCallback<A extends App> = (app: A) => void

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

  protected systems: Query<[System]>

  protected onDispose = new EventDispatcher<App>()

  constructor() {
    super()
    console.log("🐝 Bigby Initializing")

    this.registerComponent(System)
    this.registerComponent(Stage.Stage)

    this.systems = this.query([System])
  }

  async use(plugin: Plugin) {
    /* Execute the system immediately */
    const result = await plugin(this)
    if (result) this.onDispose.add(result)
  }

  dispose() {
    console.log("⛔ Stopping App")

    /* Call all dispose callbacks */
    this.onDispose.emit(this)
    this.onDispose.clear()

    /* Remove all systems */
    for (const [entity] of this.systems) {
      this.destroy(entity)
    }

    return this
  }
}
