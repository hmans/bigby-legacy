import { Bucket } from "@miniplex/bucket"

export type EventListener<P> = (payload: P) => void

export class EventDispatcher<P = void> extends Bucket<EventListener<P>> {
  emit(payload: P) {
    for (const listener of this.entities) {
      listener(payload)
    }
  }
}
