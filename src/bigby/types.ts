import { World } from "@miniplex/core"
import { App } from "./App"
import { Entity } from "./Entity"

export type System = (dt: number) => void

export type SystemFactory = (world: World<Entity>) => System

export type Plugin = (app: App) => App
