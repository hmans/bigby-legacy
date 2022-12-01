import { World } from "@bigby/ecs"
import { Plugin, StartupSystem, System } from "./types"

export type BaseEntity = {}

type Initializer = () => Promise<void>

export class App {
  world: World

  systems = new Array<System>()
  initializers = new Array<Initializer>()
  startupSystems = new Array<StartupSystem>()

  constructor() {
    this.world = new World()
  }

  addPlugin(plugin: Plugin): App {
    return plugin(this as any)
  }

  addSystem(system: System) {
    this.systems.push(system)
    return this
  }

  addStartupSystem(system: StartupSystem) {
    this.startupSystems.push(system)
    return this
  }

  addInitializer(system: Initializer) {
    this.initializers.push(system)
    return this
  }

  async run() {
    /* Execute and wait for initializers to complete */
    await Promise.all(this.initializers.map((system) => system()))

    /* Execute startup systems */
    this.startupSystems.forEach((system) => system(this))

    return this
  }
}
