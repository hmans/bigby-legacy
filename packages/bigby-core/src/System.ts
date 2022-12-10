export type SystemCallback = (dt: number) => any

export class System {
  constructor(public callback: SystemCallback) {}

  tick(dt: number) {
    return this.callback(dt)
  }
}
