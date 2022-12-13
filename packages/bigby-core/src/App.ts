import {
  Constructor,
  Entity,
  NonAbstractConstructor,
  World
} from "@maxiplex/core"
import { EventDispatcher } from "@maxiplex/event-dispatcher"
import * as Stage from "./Stage"
import { FunctionSystem, System, SystemCallback } from "./System"

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

  addSystem(system: System, stage?: NonAbstractConstructor<Stage.Stage>): Entity

  addSystem(
    callback: SystemCallback,
    stage?: NonAbstractConstructor<Stage.Stage>
  ): Entity

  addSystem(
    system: System | SystemCallback,
    stage: NonAbstractConstructor<Stage.Stage> = Stage.Update
  ) {
    return this.spawn([
      system instanceof System ? system : new FunctionSystem(this, system),
      stage
    ])
  }

  dispose() {
    console.log("⛔ Stopping App")

    /* Call all dispose callbacks */
    this.onDispose.emit(this)
    this.onDispose.clear()
  }
}
