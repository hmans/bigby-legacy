import { NonAbstractConstructor, World } from "@maxiplex/core"
import { EventDispatcher } from "@maxiplex/event-dispatcher"
import { System } from "./System"
import { SystemsPlugin } from "./SystemsPlugin"

export type Plugin<A extends App> = (app: A) => A | void

export type OnLoadCallback<A extends App> = (app: A) => void | Promise<void>

export type OnStartCallback<A extends App> = (app: A) => void | Promise<void>

export type OnStopCallback<A extends App> = (app: A) => void

export class App extends World {
  onLoadCallbacks = new Array<OnLoadCallback<typeof this>>()
  onStartCallbacks = new Array<OnStartCallback<typeof this>>()
  onStopCallbacks = new EventDispatcher<typeof this>()

  protected registeredPlugins = new Set<Plugin<typeof this>>()

  constructor() {
    super()
    console.log("🐝 Bigby Initializing")
    this.use(SystemsPlugin)
  }

  use(plugin: Plugin<typeof this>) {
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

  onLoad(callback: OnLoadCallback<typeof this>) {
    this.onLoadCallbacks.push(callback)
    return this
  }

  onStart(callback: OnStartCallback<typeof this>) {
    this.onStartCallbacks.push(callback)
    return this
  }

  onStop(callback: OnStopCallback<typeof this>) {
    this.onStopCallbacks.add(callback)
    return this
  }

  async start() {
    console.log("✅ Starting App")

    /* Execute and wait for initializers to complete */
    await Promise.all(this.onLoadCallbacks.map((callback) => callback(this)))

    /* Execute and wait for startupSystems to complete */
    await Promise.all(this.onStartCallbacks.map((callback) => callback(this)))

    return this
  }

  stop() {
    console.log("⛔ Stopping App")
    this.onStopCallbacks.emit(this)
    return this
  }
}
