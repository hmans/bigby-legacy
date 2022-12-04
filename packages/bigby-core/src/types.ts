import { App } from "./MaxiplexApp"

export type OnLoadCallback<A extends App> = (app: A) => void | Promise<void>

export type OnStartCallback<A extends App> = (app: A) => void | Promise<void>

export type OnUpdateCallback = (dt: number) => void

export type OnStopCallback<A extends App> = (app: A) => void

export type Plugin<A extends App> = (app: A) => A
