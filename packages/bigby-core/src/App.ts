import { EventDispatcher } from "@maxiplex/event-dispatcher"
import { World, TickerCallback } from "@maxiplex/core"

export class App extends World {
  onEarlyUpdateCallbacks = new EventDispatcher<number>()
  onUpdateCallbacks = new EventDispatcher<number>()
  onLateUpdateCallbacks = new EventDispatcher<number>()
  onRenderCallbacks = new EventDispatcher<number>()

  constructor() {
    console.log("🐝 Bigby Initializing")

    super()

    this.onTick((dt) => {
      this.onEarlyUpdateCallbacks.emit(dt)
      this.onLateUpdateCallbacks.emit(dt)
      this.onUpdateCallbacks.emit(dt)
      this.onRenderCallbacks.emit(dt)
    })
  }

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
