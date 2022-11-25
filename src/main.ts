import { World } from "@miniplex/core"
import engine, { Entity, Mesh } from "./bigby/systems/engine"
import transforms from "./bigby/systems/transforms"
import "./style.css"

const world = new World<Entity>()

const systems = [engine(world), transforms(world)]

world.add({ mesh: new Mesh() })

function animate() {
  requestAnimationFrame(animate)
  systems.forEach((system) => system())
}

animate()
