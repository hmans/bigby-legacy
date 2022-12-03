import { App } from "./App"

export type InitCallback = () => Promise<void>

export type StartCallback = (app: App) => void

export type UpdateCallback = (dt: number) => void

export type StopCallback = (app: App) => void

export type Plugin = (app: App) => App
