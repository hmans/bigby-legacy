import { App } from "./App"

export type SystemCallback = (dt: number) => any

export interface System {
  dispose?(): void
}

export abstract class System {
  constructor(protected app: App) {}
}

export abstract class StartupSystem extends System {
  abstract run(): void
}
