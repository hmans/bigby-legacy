import { World } from "@miniplex/core"
import { App } from "./App"

export type UpdateCallback = (dt: number) => void

export type System<E extends {}> = (app: App<E>) => UpdateCallback | void

export type StartupSystem<E extends {}> = (app: App<E>) => void

export type Plugin<E extends {}, D extends E> = (app: App<E>) => App<D>
