import { World } from "@miniplex/core"
import { vec3 } from "gl-matrix"
import { Color } from "three"
import { Mesh } from "./bigby/core/Mesh"
import { Transform } from "./bigby/core/Transform"
import { BoxGeometry } from "./bigby/geometry/BoxGeometry"
import { Material } from "./bigby/materials/Material"
import autorotate from "./bigby/systems/autorotate"
import rendering from "./bigby/systems/rendering"
import { Entity } from "./bigby/Entity"
import transforms from "./bigby/systems/transforms"
import "./style.css"
import { Camera } from "./bigby/core/Camera"

const world = new World<Entity>()

const systems = [autorotate(world), transforms(world), rendering(world)]

world.add({
  // autorotate: vec3.set(vec3.create(), 1, 1.3, 0),
  transform: new Transform(vec3.set(vec3.create(), 0, 0, 5)),
  camera: new Camera(),
})

world.add({
  autorotate: vec3.set(vec3.create(), 1, 1.3, 0),
  transform: new Transform(vec3.set(vec3.create(), -2, 0, 0)),
  mesh: new Mesh(
    new BoxGeometry(),
    new Material({
      color: new Color("hotpink"),
    })
  ),
})

world.add({
  autorotate: vec3.set(vec3.create(), 0, -1, 1.3),
  transform: new Transform(vec3.set(vec3.create(), 2, 0, 0)),
  mesh: new Mesh(
    new BoxGeometry(),
    new Material({
      color: new Color("cyan"),
    })
  ),
})

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
