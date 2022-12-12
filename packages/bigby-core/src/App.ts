import { NonAbstractConstructor, Query, World } from "@maxiplex/core"
import { System } from "./System"

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
    this.systems = this.query([System])
  }

  use(plugin: Plugin) {
    if (this.registeredPlugins.has(plugin)) return this

    /* Register and initialize the plugin */
    this.registeredPlugins.add(plugin)
    const result = plugin(this)

    return result || this
  }

  addSystem<S extends System>(
    ctor: NonAbstractConstructor<S>,
    props: Partial<S> = {}
  ) {
    const system = new ctor(this)
    Object.assign(system, props)
    this.spawn([system])
    return this
  }

  onResize = () => {
    for (const [_, system] of this.systems) {
      system.onResize?.()
    }
  }

  async start() {
    console.log("✅ Starting App")

    window.addEventListener("resize", this.onResize)

    /* Start all systems */
    /* We need to reverse here because it's important that we need to initialize systems in the order that they were added */
    for (const [_, system] of [...this.systems].reverse()) {
      system.onStart?.()
    }

    return this
  }

  stop() {
    console.log("⛔ Stopping App")

    window.removeEventListener("resize", this.onResize)

    /* Stop all systems */
    for (const [_, system] of this.systems) {
      system.onStop?.()
    }

    return this
  }
}
