import { World } from "@miniplex/core"
import { Entity } from "./Entity"
import { Plugin, SystemFactory } from "./types"

export class App {
  world: World<Entity>

  systems = new Array<(dt: number) => void>()

  constructor() {
    this.world = new World<Entity>()

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
  }

  addPlugin(plugin: Plugin) {
    return plugin(this)
  }

  addSystem(system: SystemFactory) {
    this.systems.push(system(this.world))
    return this
  }
}
