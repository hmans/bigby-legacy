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
  onLoadCallbacks = new Array<OnLoadCallback>()
  onStartCallbacks = new Array<OnStartCallback>()
  onEarlyUpdateCallbacks = new Array<OnUpdateCallback>()
  onUpdateCallbacks = new Array<OnUpdateCallback>()
  onLateUpdateCallbacks = new Array<OnUpdateCallback>()
  onRenderCallbacks = new Array<OnUpdateCallback>()
  onStopCallbacks = new Array<OnStopCallback>()

  constructor() {
    console.log("🐝 Bigby Initializing")
    super()
  }

  use(plugin: Plugin): App {
    return plugin(this as any)
  }

  onLoad(callback: OnLoadCallback) {
    this.onLoadCallbacks.push(callback)
    return this
  }

  onStart(callback: OnStartCallback) {
    this.onStartCallbacks.push(callback)
    return this
  }

  onEarlyUpdate(callback: OnUpdateCallback) {
    this.onEarlyUpdateCallbacks.push(callback)
    return this
  }

  onUpdate(callback: OnUpdateCallback) {
    this.onUpdateCallbacks.push(callback)
    return this
  }

  onLateUpdate(callback: OnUpdateCallback) {
    this.onLateUpdateCallbacks.push(callback)
    return this
  }

  onRender(callback: OnUpdateCallback) {
    this.onRenderCallbacks.push(callback)
    return this
  }

  onStop(callback: OnStopCallback) {
    this.onStopCallbacks.push(callback)
    return this
  }

  async start() {
    console.log("✅ Starting App")

    /* Execute and wait for initializers to complete */
    await Promise.all(this.onLoadCallbacks.map((callback) => callback()))

    /* Execute and wait for startupSystems to complete */
    await Promise.all(this.onStartCallbacks.map((callback) => callback(this)))

    return this
  }

  stop() {
    console.log("⛔ Stopping App")
    this.onStopCallbacks.forEach((callback) => callback(this))
    return this
  }
}
