import { EventDispatcher } from "@maxiplex/event-dispatcher"
import { App as MaxiplexApp, OnUpdateCallback } from "@maxiplex/core"

export class App extends MaxiplexApp {
  onEarlyUpdateCallbacks = new EventDispatcher<number>()
  onLateUpdateCallbacks = new EventDispatcher<number>()
  onRenderCallbacks = new EventDispatcher<number>()

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
