import { World } from "@miniplex/core"
import { Entity } from "../Entity"
import * as RAPIER from "@dimforge/rapier3d"

await import("@dimforge/rapier3d")

export class RigidBody {
  rigidBody?: RAPIER.RigidBody
  collider?: RAPIER.Collider
}

export default (world: World<Entity>) => {
  const physics = new RAPIER.World({ x: 0, y: 0, z: 0 })

  const entities = world.with("rigidbody", "transform")

  entities.onEntityAdded.add((entity) => {
    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(
      entity.transform.position[0],
      entity.transform.position[1],
      entity.transform.position[2]
    )

    entity.rigidbody.rigidBody = physics.createRigidBody(rigidBodyDesc)

    // Create a cuboid collider attached to the dynamic rigidBody.
    let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
    entity.rigidbody.collider = physics.createCollider(
      colliderDesc,
      entity.rigidbody.rigidBody
    )
  })

  return (dt: number) => {
    physics.timestep = dt
    physics.step()

    for (const entity of entities) {
      const position = entity.rigidbody.rigidBody!.translation()
      entity.transform.position[0] = position.x
      entity.transform.position[1] = position.y
      entity.transform.position[2] = position.z
    }
  }
}
