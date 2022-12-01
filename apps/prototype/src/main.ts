import { quat, vec3 } from "gl-matrix"
import "./style.css"

class Transform {
  constructor(
    public position = vec3.create(),
    public quaternion = quat.create(),
    public scale = vec3.set(vec3.create(), 1, 1, 1)
  ) {}
}

class AutoRotate {
  constructor(public speed = 1) {}
}

const world = new World<Transform | AutoRotate>()

world.spawn([new Transform(), new AutoRotate()])

console.log("Complete entity:")
for (const entity of world.entities) {
  console.log(entity)
}

console.log("AutoRotate:")
const query = new Query(world, [AutoRotate, Transform])
query.iterate((entity, [autoRotate, transform]) => {
  console.log(transform)
  quat.rotateY(transform.quaternion, transform.quaternion, autoRotate.speed)
})
