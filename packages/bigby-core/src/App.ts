import { World } from "@miniplex/core"
import { Plugin, StartupSystem, System } from "./types"

export type BaseEntity = {}

type Initializer = () => Promise<void>

export class App<E extends BaseEntity = BaseEntity> {
  world: World<E>

  systems = new Array<System>()
  initializers = new Array<Initializer>()
  startupSystems = new Array<StartupSystem<E>>()

  constructor() {
    this.world = new World<E>()
  }

  addPlugin<D extends E>(plugin: Plugin<D>): App<E & D> {
    return plugin(this as any)
  }

  addSystem(system: System) {
    this.systems.push(system)
    return this
  }

  addStartupSystem(system: StartupSystem<E>) {
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
