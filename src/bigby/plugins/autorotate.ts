import { World } from "@miniplex/core"
import { quat } from "gl-matrix"
import { App } from "../App"
import { Entity } from "../Entity"

function AutorotateSystem(world: World<Entity>) {
  const entities = world.with("transform", "autorotate")

  return (dt: number) => {
    for (const { transform, autorotate } of entities) {
      quat.rotateX(transform.quaternion, transform.quaternion, autorotate[0] * dt)
      quat.rotateY(transform.quaternion, transform.quaternion, autorotate[1] * dt)
      quat.rotateZ(transform.quaternion, transform.quaternion, autorotate[2] * dt)
    }
  }
}

export default function AutorotatePlugin(app: App) {
  app.addSystem(AutorotateSystem)
  return app
}
