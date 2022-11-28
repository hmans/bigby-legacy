import { World } from "@miniplex/core"
import { clamp } from "@bigby/math"
import { Plugin, StartupSystem, System } from "./types"

export type BaseEntity = {}

export class App<E extends BaseEntity> {
  world: World<E>

  systems = new Array<System>()
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

  run() {
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
      this.systems.forEach((system) => system(dt))
    }

    animate()

    return this
  }
}