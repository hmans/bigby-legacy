import { World } from "@miniplex/core"
import { Plugin, SystemFactory } from "./types"

export type BaseEntity = {}

export class App<E extends BaseEntity> {
  world: World<E>

  systems = new Array<(dt: number) => void>()

  constructor() {
    this.world = new World<E>()
  }

  addPlugin<D extends E>(plugin: Plugin<E, D>): App<D> {
    return plugin(this)
  }

  addSystem(system: SystemFactory<any>) {
    this.systems.push(system(this.world))
    return this
  }

  run() {
    /* Tick */
    let lastTime = performance.now()

    const animate = () => {
      requestAnimationFrame(animate)

      /* Calculate delta time */
      const time = performance.now()
      const dt = (time - lastTime) / 1000
      lastTime = time

      /* Update systems */
      this.systems.forEach((system) => system(dt))
    }

    animate()

    return this
  }
}
