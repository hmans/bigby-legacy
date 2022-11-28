import { App } from "./App"

export type System = (dt: number) => void

export type StartupSystem<E extends {}> = (app: App<E>) => void

export type Plugin<E extends {}, D extends E> = (app: App<E>) => App<D>
