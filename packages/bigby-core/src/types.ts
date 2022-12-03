import { App } from "./App"

export type System = (dt: number) => void

export type SystemStopCallback = (app: App) => void

export type StartupSystem = (app: App) => void

export type Plugin = (app: App) => App
