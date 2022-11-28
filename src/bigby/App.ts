import { World } from "@miniplex/core"
import { clamp } from "./helpers"
import { Plugin, StartupSystem, System, UpdateCallback } from "./types"

export type BaseEntity = {}

export class App<E extends BaseEntity> {
  world: World<E>

  updateCallbacks = new Array<UpdateCallback>()
  systems = new Array<System<any>>()
  startupSystems = new Array<StartupSystem<E>>()

  constructor() {
    this.world = new World<E>()
  }

  addPlugin<D extends E>(plugin: Plugin<E, D>): App<D> {
    return plugin(this)
  }

  addSystem<D extends E>(system: System<D>) {
    this.systems.push(system)
    return this
  }

  addStartupSystem(system: StartupSystem<E>) {
    this.startupSystems.push(system)
    return this
  }

  run() {
    /* Initialize all systems */
    for (const systemFactory of this.systems) {
      const update = systemFactory(this)
      if (update) this.updateCallbacks.push(update)
    }

    /* Execute startup systems */
    this.startupSystems.forEach((system) => system(this))

    /* Tick */
    let lastTime = performance.now()

    const animate = () => {
      requestAnimationFrame(animate)

      /* Calculate delta time */
      const time = performance.now()
      const dt = clamp((time - lastTime) / 1000, 0, 0.2)
      lastTime = time

      /* Update systems */
      this.updateCallbacks.forEach((system) => system(dt))
    }

    animate()

    return this
  }
}
