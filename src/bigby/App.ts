import { World } from "@miniplex/core"
import { Entity } from "./Entity"
import autorotate from "./systems/autorotate"
import physics from "./systems/physics"
import rendering from "./systems/rendering"
import transforms from "./systems/transforms"

export class App {
  world: World<Entity>

  constructor(setup?: (world: World<Entity>) => void) {
    this.world = new World<Entity>()

    const systems = [
      physics(this.world),
      autorotate(this.world),
      transforms(this.world),
      rendering(this.world),
    ]

    setup?.(this.world)

    /* Tick */
    let lastTime = performance.now()

    function animate() {
      requestAnimationFrame(animate)

      /* Calculate delta time */
      const time = performance.now()
      const dt = (time - lastTime) / 1000
      lastTime = time

      /* Update systems */
      systems.forEach((system) => system(dt))
    }

    animate()
  }
}
