import { World } from "@miniplex/core"
import { Transform } from "./bigby/core/Transform"
import engine, { Entity, Mesh } from "./bigby/systems/engine"
import transforms from "./bigby/systems/transforms"
import "./style.css"

const world = new World<Entity>()

const systems = [engine(world), transforms(world)]

const a = world.add({
  transform: new Transform(),
  mesh: new Mesh()
})

// world.add({
//   transform: new Transform(),
//   parent: a,
//   mesh: new Mesh()
// })

function animate() {
  requestAnimationFrame(animate)
  systems.forEach((system) => system())
}

animate()
