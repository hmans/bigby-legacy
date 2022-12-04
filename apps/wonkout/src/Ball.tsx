import * as Physics from "@bigby/plugin-physics3d"
import { App, apply, Transform3D } from "bigby"
import * as THREE from "three"
import { ConstantVelocity } from "./ConstantVelocityPlugin"

export const Ball = (app: App) =>
  app.onStart((app) => {
    /* Ball */
    const ball = app.add([
      new Physics.DynamicBody().setEnabledTranslations(true, true, false),
      new Transform3D([0, -5, 0]),
      new Physics.BallCollider(0.5).setDensity(1),
      new ConstantVelocity(10),
      apply(
        new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.6, 0),
          new THREE.MeshStandardMaterial({
            color: new THREE.Color("white").multiplyScalar(2)
          })
        ),
        { castShadow: true }
      )
    ])

    /* I don't have the APIs yet, so please don't look at this */
    const rb = ball.get(Physics.DynamicBody)!.raw!
    const coll = ball.get(Physics.BallCollider)!.raw!
    rb.setLinearDamping(0)
    rb.applyImpulse({ x: 0, y: 10, z: 0 }, true)
    coll.setRestitution(1)
  })
