import { NonAbstractConstructor } from "@maxiplex/core"
import { App } from "./App"

export type SystemCallback = (dt: number) => any

export interface System {
  dispose?(): void
}

export abstract class System {
  constructor(public app: App) {}
  abstract run(dt: number): void
}

export class FunctionSystem extends System {
  constructor(app: App, protected callback: SystemCallback) {
    super(app)
  }

  run(dt: number) {
    this.callback(dt)
  }
}

export const system = (callback: SystemCallback) =>
  class extends System {
    run(dt: number) {
      callback(dt)
    }
  }

export function isSystemConstructor(
  fun: Function
): fun is NonAbstractConstructor<System> {
  return fun.prototype instanceof System
}
