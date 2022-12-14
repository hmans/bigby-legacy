import { Constructor } from "@maxiplex/core"
import { App } from "./App"

export type SystemCallback = (dt: number) => any

export interface System {
  dispose?(): void
  start?(): void | Promise<void>
  run?(dt: number): void
}

export type SystemState = "stopped" | "starting" | "running"

export abstract class System {
  state: SystemState = "stopped"
  promise?: Promise<any>

  constructor(public app: App) {}
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

export function isSystemConstructor(fun: Function): fun is Constructor<System> {
  return fun.prototype instanceof System
}
