import { App } from "./App"

export type SystemCallback = (dt: number) => any

export interface System {
  onEarlyUpdate?(dt: number): void
  onFixedUpdate?(dt: number): void
  onUpdate?(dt: number): void
  onLateUpdate?(dt: number): void
  onRender?(dt: number): void
}

export abstract class System {
  constructor(public app: App) {}
}
