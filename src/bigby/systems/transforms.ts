import { World } from "@miniplex/core"
import { mat4, quat } from "gl-matrix"
import { Entity } from "./engine"

export default (world: World<Entity>) => {
  const entities = world.with("transform")

  return () => {
    for (const { transform } of entities) {
      if (!transform.autoUpdate) continue

      quat.rotateZ(transform.quaternion, transform.quaternion, 0.01)

      mat4.fromRotationTranslationScale(
        transform.matrix,
        transform.quaternion,
        transform.position,
        transform.scale
      )
    }
  }
}
