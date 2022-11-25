import { World } from "@miniplex/core"
import engine, { Entity, Mesh } from "./bigby/engine"
import "./style.css"

const world = new World<Entity>()

const systems = [engine(world)]

world.add({ mesh: new Mesh() })

function animate() {
  requestAnimationFrame(animate)
  systems.forEach((system) => system())
}

animate()
