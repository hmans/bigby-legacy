import { App } from "./App"

export type InitCallback = () => void | Promise<void>

export type StartCallback = (app: App) => void | Promise<void>

export type UpdateCallback = (dt: number) => void

export type StopCallback = (app: App) => void

export type Plugin = (app: App) => App
