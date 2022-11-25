import { World } from "@miniplex/core"
import engine, { Entity } from "./bigby/engine"
import "./style.css"

const world = new World<Entity>()

const systems = [engine(world)]

world.add({ engine: true })

function animate() {
  requestAnimationFrame(animate)

  /* Execute systems */
  systems.forEach((system) => system())
}

animate()
