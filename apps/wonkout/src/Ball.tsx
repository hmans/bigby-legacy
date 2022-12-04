import * as Physics from "@bigby/plugin-physics3d"
import { Parent3D } from "@bigby/plugin-three"
import { App, apply, make, Transform3D } from "bigby"
import * as THREE from "three"
import { ConstantVelocity } from "./ConstantVelocityPlugin"

export const Ball = (app: App) =>
  app.onStart((app) => {
    /* Ball */
    const ball = app.add([
      new Physics.DynamicBody((desc) =>
        desc.enabledTranslations(true, true, false)
      ),

      new Transform3D([0, -5, 0]),
      new Physics.BallCollider(0.3).setDensity(1),
      new ConstantVelocity(10),

      make(THREE.Mesh, [], {
        geometry: new THREE.IcosahedronGeometry(0.4, 0),
        material: make(THREE.MeshStandardMaterial, [], {
          color: new THREE.Color("white").multiplyScalar(2),
          side: THREE.BackSide
        }),
        castShadow: true
      })
    ])

    /* Light */
    app.add([
      new Transform3D(),
      make(THREE.PointLight, ["hotpink", 3, 10], {
        castShadow: true
      }),
      make(Parent3D, [ball.get(THREE.Object3D)!])
    ])

    /* I don't have the APIs yet, so please don't look at this */
    const rb = ball.get(Physics.DynamicBody)!.raw!
    const coll = ball.get(Physics.BallCollider)!.raw!
    rb.setLinearDamping(0)
    rb.applyImpulse({ x: 0, y: 10, z: 0 }, true)
    coll.setRestitution(1)
  })
