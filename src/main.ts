import { quat } from "gl-matrix"
import { plusMinus } from "randomish"
import { Color } from "three"
import { App } from "./bigby/App"
import { Camera } from "./bigby/core/Camera"
import { Mesh } from "./bigby/core/Mesh"
import { Transform } from "./bigby/core/Transform"
import { BoxGeometry } from "./bigby/geometry/BoxGeometry"
import { Material } from "./bigby/materials/Material"
import AutorotatePlugin from "./bigby/plugins/autorotate"
import PhysicsPlugin, { RigidBody } from "./bigby/plugins/physics"
import RenderingPlugin from "./bigby/plugins/rendering"
import "./style.css"

await import("@dimforge/rapier3d")

const app = new App()
  .addPlugin(PhysicsPlugin)
  .addPlugin(AutorotatePlugin)
  .addPlugin(RenderingPlugin)

app.world.add({
  transform: new Transform([0, 0, 20]),
  camera: new Camera(70, 0.1, 1000),
})

const geometry = new BoxGeometry()
const material = new Material({
  color: new Color("hotpink"),
})

for (let i = 0; i < 100; i++) {
  app.world.add({
    transform: new Transform(
      [plusMinus(20), plusMinus(10), 0],
      quat.random(quat.create())
    ),
    mesh: new Mesh(geometry, material),
    rigidbody: new RigidBody(),
  })
}
