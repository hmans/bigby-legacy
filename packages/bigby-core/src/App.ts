import { World } from "@bigby/ecs"
import {
  OnLoadCallback,
  Plugin,
  OnStartCallback,
  OnStopCallback,
  OnUpdateCallback
} from "./types"

export type BaseEntity = {}

export class App extends World {
  onUpdateCallbacks = new Array<OnUpdateCallback>()
  onLoadCallbacks = new Array<OnLoadCallback>()
  onStartCallbacks = new Array<OnStartCallback>()
  onStopCallbacks = new Array<OnStopCallback>()

  constructor() {
    console.log("🐝 Bigby Initializing")
    super()
  }

  use(plugin: Plugin): App {
    return plugin(this as any)
  }

  onLoad(system: OnLoadCallback) {
    this.onLoadCallbacks.push(system)
    return this
  }

  onStart(system: OnStartCallback) {
    this.onStartCallbacks.push(system)
    return this
  }

  onUpdate(system: OnUpdateCallback) {
    this.onUpdateCallbacks.push(system)
    return this
  }

  onStop(callback: OnStopCallback) {
    this.onStopCallbacks.push(callback)
    return this
  }

  async start() {
    console.log("✅ Starting App")

    /* Execute and wait for initializers to complete */
    await Promise.all(this.onLoadCallbacks.map((system) => system()))

    /* Execute and wait for startupSystems to complete */
    await Promise.all(this.onStartCallbacks.map((system) => system(this)))

    return this
  }

  stop() {
    console.log("⛔ Stopping App")
    this.onStopCallbacks.forEach((callback) => callback(this))
    return this
  }
}
