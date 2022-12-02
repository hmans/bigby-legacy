import { App } from "./App"

export type System = (dt: number) => void

export type SystemStopCallback = () => void

export type StartupSystem = (app: App) => void | SystemStopCallback

export type Plugin = (app: App) => App
