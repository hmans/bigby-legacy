import { World } from "@miniplex/core"
import { Mesh } from "./bigby/core/Mesh"
import { Transform } from "./bigby/core/Transform"
import { Material } from "./bigby/materials/Material"
import engine, { Entity } from "./bigby/systems/engine"
import transforms from "./bigby/systems/transforms"
import "./style.css"

const world = new World<Entity>()

const systems = [engine(world), transforms(world)]

world.add({
  transform: new Transform(),
  mesh: new Mesh(new Material()),
})

function animate() {
  requestAnimationFrame(animate)
  systems.forEach((system) => system())
}

animate()
