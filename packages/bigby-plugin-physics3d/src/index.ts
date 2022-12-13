import { App, Object3D, Stage } from "@bigby/core"
import * as RAPIER from "@dimforge/rapier3d-compat"
import { RigidBody } from "./bodies"
import { Collider } from "./colliders"
import { PhysicsSystem } from "./system"

export * from "./bodies"
export * from "./colliders"
export * from "./system"

export async function InitPhysics() {
  return await RAPIER.init()
}

export const Plugin =
  ({ gravity = [0, -9.81, 0] }: { gravity?: [number, number, number] } = {}) =>
  async (app: App) => {
    app
      /* Make sure this component is known to the app. We'll need it! */
      .requireComponent(Object3D)

      /* Let the app know which components we will be adding. */
      .registerComponent(RigidBody)
      .registerComponent(Collider)

    await RAPIER.init()

    app.addSystem(new PhysicsSystem(app, { gravity }), Stage.FixedUpdate)
  }
