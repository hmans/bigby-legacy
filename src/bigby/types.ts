import { World } from "@miniplex/core"
import { App } from "./App"

export type System = (dt: number) => void

export type SystemFactory<E extends {}> = (world: World<E>) => System

export type Plugin<E extends {}, D extends E> = (app: App<E>) => App<D>
