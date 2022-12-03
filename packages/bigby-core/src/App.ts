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
  systems = new Array<OnUpdateCallback>()
  initializers = new Array<OnLoadCallback>()
  startupSystems = new Array<OnStartCallback>()
  stopCallbacks = new Array<OnStopCallback>()

  constructor() {
    console.log("🐝 Bigby Initializing")
    super()
  }

  use(plugin: Plugin): App {
    return plugin(this as any)
  }

  onLoad(system: OnLoadCallback) {
    this.initializers.push(system)
    return this
  }

  onStart(system: OnStartCallback) {
    this.startupSystems.push(system)
    return this
  }

  onUpdate(system: OnUpdateCallback) {
    this.systems.push(system)
    return this
  }

  onStop(callback: OnStopCallback) {
    this.stopCallbacks.push(callback)
    return this
  }

  async start() {
    console.log("✅ Starting App")

    /* Execute and wait for initializers to complete */
    await Promise.all(this.initializers.map((system) => system()))

    /* Execute and wait for startupSystems to complete */
    await Promise.all(this.startupSystems.map((system) => system(this)))

    return this
  }

  stop() {
    console.log("⛔ Stopping App")
    this.stopCallbacks.forEach((callback) => callback(this))
    return this
  }
}
