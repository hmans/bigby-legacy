import { App } from "./App"

export interface IEntity extends Record<string, any> {}

export type System = (dt: number) => void

export type StartupSystem<E extends IEntity> = (app: App<E>) => void

export type Plugin<E extends IEntity> = (app: App<E>) => App<E>
