import { World } from "@miniplex/core"
import { quat, vec3 } from "gl-matrix"
import { App, BaseEntity } from "../App"
import { Transform } from "../core/Transform"

interface IAutoRotate {
  autorotate: vec3
  transform: Transform
}

function AutorotateSystem(world: World<Partial<IAutoRotate>>) {
  const entities = world.with("transform", "autorotate")

  return (dt: number) => {
    for (const { transform, autorotate } of entities) {
      quat.rotateX(transform.quaternion, transform.quaternion, autorotate[0] * dt)
      quat.rotateY(transform.quaternion, transform.quaternion, autorotate[1] * dt)
      quat.rotateZ(transform.quaternion, transform.quaternion, autorotate[2] * dt)
    }
  }
}

export default function AutorotatePlugin<E extends BaseEntity>(
  app: App<E>
): App<E & Partial<IAutoRotate>> {
  return app.addSystem(AutorotateSystem)
}
