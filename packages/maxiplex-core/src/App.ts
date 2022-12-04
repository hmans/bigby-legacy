import { EventDispatcher } from "@maxiplex/event-dispatcher"
import { World } from "./World"

export type OnLoadCallback<A extends App> = (app: A) => void | Promise<void>

export type OnStartCallback<A extends App> = (app: A) => void | Promise<void>

export type OnUpdateCallback = (dt: number) => void

export type OnStopCallback<A extends App> = (app: A) => void

export type Plugin<A extends App> = (app: A) => A

export type BaseEntity = {}

export class App extends World {
  onLoadCallbacks = new Array<OnLoadCallback<typeof this>>()
  onStartCallbacks = new Array<OnStartCallback<typeof this>>()
  onUpdateCallbacks = new EventDispatcher<number>()
  onStopCallbacks = new EventDispatcher<typeof this>()

  constructor() {
    console.log("🐝 Bigby Initializing")
    super()
  }

  use(plugin: Plugin<typeof this>) {
    return plugin(this as any)
  }

  onLoad(callback: OnLoadCallback<typeof this>) {
    this.onLoadCallbacks.push(callback)
    return this
  }

  onStart(callback: OnStartCallback<typeof this>) {
    this.onStartCallbacks.push(callback)
    return this
  }

  onUpdate(callback: OnUpdateCallback) {
    this.onUpdateCallbacks.add(callback)
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
