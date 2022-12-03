import { App } from "./App"

export type OnLoadCallback = () => void | Promise<void>

export type OnStartCallback = (app: App) => void | Promise<void>

export type OnUpdateCallback = (dt: number) => void

export type OnStopCallback = (app: App) => void

export type Plugin = (app: App) => App
