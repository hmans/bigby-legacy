import { World } from "@miniplex/core"
import { quat } from "gl-matrix"
import { Entity } from "./engine"

export default (world: World<Entity>) => {
  const entities = world.with("transform", "autorotate")

  return () => {
    for (const { transform } of entities) {
      quat.rotateZ(transform.quaternion, transform.quaternion, 0.01)
    }
  }
}
