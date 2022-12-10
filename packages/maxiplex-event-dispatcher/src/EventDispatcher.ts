export type EventListener<P> = (payload: P) => void

export class EventDispatcher<P = void> {
  listeners = new Set<EventListener<P>>()

  constructor() {
    this.emit = this.emit.bind(this)
  }

  clearListeners() {
    this.listeners.clear()
  }

  addListener(listener: EventListener<P>) {
    this.listeners.add(listener)
    return () => this.removeListener(listener)
  }

  removeListener(listener: EventListener<P>) {
    this.listeners.delete(listener)
  }

  emit(payload: P) {
    for (const listener of this.listeners) {
      listener(payload)
    }
  }
}
