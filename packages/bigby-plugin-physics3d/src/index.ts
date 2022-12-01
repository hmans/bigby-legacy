import { App, ITransform } from "@bigby/core"
import { clamp } from "@bigby/math"
import * as RAPIER from "@dimforge/rapier3d-compat"
import { quat, vec3 } from "gl-matrix"

export class RigidBody {
  rigidBody?: RAPIER.RigidBody
  collider?: RAPIER.Collider
}

export interface IRigidBody {
  rigidbody: RigidBody
}

function PhysicsSystem(app: App<Partial<IRigidBody & ITransform>>) {
  const physics = new RAPIER.World({ x: 0, y: 0, z: 0 })

  const entities = app.world.with("rigidbody", "transform")

  entities.onEntityAdded.add((entity) => {
    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()

    rigidBodyDesc.setTranslation(
      entity.transform.position[0],
      entity.transform.position[1],
      entity.transform.position[2]
    )

    rigidBodyDesc.setRotation({
      x: entity.transform.quaternion[0],
      y: entity.transform.quaternion[1],
      z: entity.transform.quaternion[2],
      w: entity.transform.quaternion[3]
    })

    rigidBodyDesc.enabledTranslations(true, true, false)

    rigidBodyDesc.setLinearDamping(0.5)
    rigidBodyDesc.setAngularDamping(0.5)

    entity.rigidbody.rigidBody = physics.createRigidBody(rigidBodyDesc)

    // Create a cuboid collider attached to the dynamic rigidBody.
    let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5).setDensity(5.0)
    entity.rigidbody.collider = physics.createCollider(
      colliderDesc,
      entity.rigidbody.rigidBody
    )
  })

  return (dt: number) => {
    physics.timestep = clamp(dt, 0.01, 0.2)
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

export function PhysicsPlugin(app: App<Partial<ITransform & IRigidBody>>) {
  app.addInitializer(async function () {
    await RAPIER.init()
  })

  app.addStartupSystem((app) => {
    app.addSystem(PhysicsSystem(app))
  })

  return app
}
