import { Event } from "@bigby/event"
import { App as MaxiplexApp } from "./MaxiplexApp"
import { OnUpdateCallback } from "./types"

export class App extends MaxiplexApp {
  onEarlyUpdateCallbacks = new Event<number>()
  onLateUpdateCallbacks = new Event<number>()
  onRenderCallbacks = new Event<number>()

  onEarlyUpdate(callback: OnUpdateCallback) {
    this.onEarlyUpdateCallbacks.add(callback)
    return this
  }

  onLateUpdate(callback: OnUpdateCallback) {
    this.onLateUpdateCallbacks.add(callback)
    return this
  }

  onRender(callback: OnUpdateCallback) {
    this.onRenderCallbacks.add(callback)
    return this
  }
}
