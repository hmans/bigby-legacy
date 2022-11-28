import { quat, vec3 } from "gl-matrix"
import { App } from "../../../bigby-core/src/App"

import { ITransform } from "../../../bigby-webgl2/src/plugin"

interface IAutoRotate {
  autorotate: vec3
}

export default function AutorotatePlugin(
  app: App<Partial<ITransform & IAutoRotate>>
) {
  const entities = app.world.with("transform", "autorotate")

  app.addSystem((dt: number) => {
    for (const { transform, autorotate } of entities) {
      quat.rotateX(
        transform.quaternion,
        transform.quaternion,
        autorotate[0] * dt
      )
      quat.rotateY(
        transform.quaternion,
        transform.quaternion,
        autorotate[1] * dt
      )
      quat.rotateZ(
        transform.quaternion,
        transform.quaternion,
        autorotate[2] * dt
      )
    }
  })

  return app
}
