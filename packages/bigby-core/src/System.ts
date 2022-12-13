import { App } from "./App"

export type SystemCallback = (dt: number) => any

export abstract class System {
  abstract run(): void
}
