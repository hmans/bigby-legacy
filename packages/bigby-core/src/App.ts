import { EventDispatcher } from "@maxiplex/event-dispatcher"
import { App as MaxiplexApp, TickerCallback } from "@maxiplex/core"

export class App extends MaxiplexApp {
  onEarlyUpdateCallbacks = new EventDispatcher<number>()
  onUpdateCallbacks = new EventDispatcher<number>()
  onLateUpdateCallbacks = new EventDispatcher<number>()
  onRenderCallbacks = new EventDispatcher<number>()

  onEarlyUpdate(callback: TickerCallback) {
    this.onEarlyUpdateCallbacks.add(callback)
    return this
  }

  onUpdate(callback: TickerCallback) {
    this.onUpdateCallbacks.add(callback)
    return this
  }

  onLateUpdate(callback: TickerCallback) {
    this.onLateUpdateCallbacks.add(callback)
    return this
  }

  onRender(callback: TickerCallback) {
    this.onRenderCallbacks.add(callback)
    return this
  }
}
