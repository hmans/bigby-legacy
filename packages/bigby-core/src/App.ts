import {
  Constructor,
  NonAbstractConstructor,
  Query,
  World
} from "@maxiplex/core"
import * as Stage from "./Stage"
import { System, SystemCallback } from "./System"

export type Plugin = (app: App) => App | void

export type OnLoadCallback<A extends App> = (app: A) => void | Promise<void>
export type OnStartCallback<A extends App> = (app: A) => void | Promise<void>
export type OnStopCallback<A extends App> = (app: A) => void

export const DEFAULT_STAGES = [
  "onEarlyUpdate",
  "onFixedUpdate",
  "onUpdate",
  "onLateUpdate",
  "onRender"
] as const

export class App extends World {
  protected registeredPlugins = new Set<Plugin>()

  protected systems: Query<[System]>

  constructor() {
    super()
    console.log("🐝 Bigby Initializing")

    this.registerComponent(System)
    this.registerComponent(Stage.Stage)

    this.systems = this.query([System])

    /* When a new system arrives in the Start stage, execute it once */
    const startSystems = this.query([System, Stage.Start])
    startSystems.onEntityAdded.add((entity) => {
      entity.get(System)!.run()
    })
  }

  use(plugin: Plugin) {
    if (this.registeredPlugins.has(plugin)) return this

    /* Register and initialize the plugin */
    this.registeredPlugins.add(plugin)
    const result = plugin(this)

    return result || this
  }

  addSystem(
    system: System | NonAbstractConstructor<System>,
    stage: NonAbstractConstructor<Stage.Stage> = Stage.Update
  ) {
    this.spawn([system, stage])

    return this
  }

  dispose() {
    console.log("⛔ Stopping App")

    return this
  }
}
