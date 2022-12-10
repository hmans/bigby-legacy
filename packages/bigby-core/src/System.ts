import { App } from "./App"

export type SystemCallback = (dt: number) => any

export class System {
  constructor(public app: App, public callback?: SystemCallback) {}

  tick(dt: number) {
    return this.callback?.(dt)
  }
}
