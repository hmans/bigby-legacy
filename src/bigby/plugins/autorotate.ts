import { World } from "@miniplex/core"
import { quat, vec3 } from "gl-matrix"
import { App } from "../App"

import { ITransform } from "./rendering"

interface IAutoRotate {
  autorotate: vec3
}

function AutorotateSystem(world: World<Partial<IAutoRotate & ITransform>>) {
  const entities = world.with("transform", "autorotate")

  return (dt: number) => {
    for (const { transform, autorotate } of entities) {
      quat.rotateX(transform.quaternion, transform.quaternion, autorotate[0] * dt)
      quat.rotateY(transform.quaternion, transform.quaternion, autorotate[1] * dt)
      quat.rotateZ(transform.quaternion, transform.quaternion, autorotate[2] * dt)
    }
  }
}

export default function AutorotatePlugin<E extends Partial<ITransform>>(
  app: App<E>
): App<E & Partial<IAutoRotate>> {
  return app.addSystem(AutorotateSystem)
}
