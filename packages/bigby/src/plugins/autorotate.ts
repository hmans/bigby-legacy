import { App, ITransform, transform } from "@bigby/core"
import { quat, vec3 } from "gl-matrix"

interface IAutoRotate {
  autorotate: vec3
}

export function AutorotatePlugin(app: App<Partial<ITransform & IAutoRotate>>) {
  const entities = app.world.with(transform, "autorotate")

  app.addSystem((dt: number) => {
    for (const { [transform]: t, autorotate } of entities) {
      quat.rotateX(t.quaternion, t.quaternion, autorotate[0] * dt)
      quat.rotateY(t.quaternion, t.quaternion, autorotate[1] * dt)
      quat.rotateZ(t.quaternion, t.quaternion, autorotate[2] * dt)
    }
  })

  return app
}
