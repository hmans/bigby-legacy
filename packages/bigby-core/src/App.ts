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
  /**
   * A list of all the plugins that have been registered. We use this to make
   * sure the user doesn't accidentally register the same plugin twice. Plugins
   * are checked through reference equality, so if the user passes an anonymous
   * function, all bets are off.
   */
  protected registeredPlugins = new Set<Plugin>()

  /**
   * An event that will be fired when this app is disposed. We use this to
   * allow plugins to clean up after themselves, by registering their returned
   * dispose callbacks with this event.
   */
  protected onDispose = new EventDispatcher<App>()

  constructor() {
    super()
    console.log("🐝 Bigby Initializing")

    this.registerComponent(System)
    this.registerComponent(Stage.Stage)

    /* Whenever a system is removed, call its dispose method */
    this.query([System]).onEntityRemoved.add((entity) => {
      const system = entity.get(System)!
      if (system.dispose) system.dispose()
    })
  }

  /**
   * Applies a plugin to the app. Plugins are simply functions that receive a reference
   * to the app as their only argument. They can use this reference to add systems, components,
   * and other plugins.
   *
   * @param plugin The plugin to use.
   * @returns A reference to this app, for chaining.
   */
  async use(plugin: Plugin) {
    if (this.registeredPlugins.has(plugin)) return this
    this.registeredPlugins.add(plugin)

    /* Execute the plugin immediately */
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
    constructor: Constructor<System>,
    stage?: NonAbstractConstructor<Stage.Stage>
  ): Entity

  addSystem(
    a: System | SystemCallback | Constructor<System>,
    stage: NonAbstractConstructor<Stage.Stage> = Stage.Update
  ) {
    let system: System

    if (typeof a === "function") {
      try {
        // @ts-ignore
        system = new a(this)
      } catch (e) {
        system = new FunctionSystem(this, a as SystemCallback)
      }
    } else {
      system = a
    }

    return this.spawn([
      system instanceof System ? system : new FunctionSystem(this, system),
      stage
    ])
  }

  /**
   * Disposes of this app. This will remove all systems, and call their dispose
   * methods if they have one. It will also fire the onDispose event, invoking
   * all registered plugins' dispose callbacks.
   */
  dispose() {
    console.log("⛔ Stopping App")

    /* Call all dispose callbacks */
    this.onDispose.emit(this)
    this.onDispose.clear()

    /* Remove all systems */
    for (const [entity] of this.query([System])) {
      this.destroy(entity)
    }
  }
}
