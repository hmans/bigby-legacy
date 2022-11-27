import { World } from "@miniplex/core"
import * as RAPIER from "@dimforge/rapier3d"
import { quat, vec3 } from "gl-matrix"
import { App } from "../App"
import { ITransform } from "./rendering"

export class RigidBody {
  rigidBody?: RAPIER.RigidBody
  collider?: RAPIER.Collider
}

export interface IRigidBody {
  rigidbody: RigidBody
}

function PhysicsSystem(world: World<Partial<IRigidBody & ITransform>>) {
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
      vec3.set(entity.transform.position, position.x, position.y, position.z)

      const rotation = entity.rigidbody.rigidBody!.rotation()
      quat.set(
        entity.transform.quaternion,
        rotation.x,
        rotation.y,
        rotation.z,
        rotation.w
      )
    }
  }
}

export default function PhysicsPlugin<E extends {}>(
  app: App<E>
): App<E & Partial<IRigidBody>> {
  return app.addSystem(PhysicsSystem)
}
