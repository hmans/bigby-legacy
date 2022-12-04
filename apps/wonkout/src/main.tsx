import { InputPlugin } from "@bigby/plugin-input"
import * as Physics from "@bigby/plugin-physics3d"
import { RigidBody } from "@bigby/plugin-physics3d"
import { ThreePlugin } from "@bigby/plugin-three"
import { ThreePostprocessingPlugin } from "@bigby/plugin-three-postprocessing"
import { App, apply, TickerPlugin, Transform3D, TransformsPlugin } from "bigby"
import * as THREE from "three"
import { Bricks } from "./Bricks"
import { Floor } from "./Floor"
import "./index.css"
import { Player, PlayerComponent } from "./Player"
import { Walls } from "./Walls"

class ConstantVelocity {
  constructor(public velocity: number) {}
}

const setupScene = (app: App) => {
  /* Camera */
  app.add([
    new Transform3D([0, 0, 15]),
    new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
  ])

  /* Lights */
  app.add([new Transform3D([0, 0, 0]), new THREE.AmbientLight(0xffffff, 1)])

  {
    const light = new THREE.DirectionalLight(0xffffff, 0.2)
    app.add([new Transform3D([50, 80, 100]), light])

    light.castShadow = true

    const { shadow } = light
    shadow.bias = 0.0001
    shadow.camera.left = -15
    shadow.camera.right = 15
    shadow.camera.top = 15
    shadow.camera.bottom = -15
    shadow.mapSize.width = 1024
    shadow.mapSize.height = 1024
  }
}

const setupBall = (app: App) => {
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
}

const ConstantVelocityPlugin = (app: App) =>
  app.onStart((app) => {
    const query = app.query([ConstantVelocity, RigidBody])

    app.onUpdate(() => {
      for (const [_, v, rigidbody] of query) {
        const rb = rigidbody.raw!
        const vel = rb.linvel()
        const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z)
        const ratio = v.velocity / speed

        rb.setLinvel(
          { x: vel.x * ratio, y: vel.y * ratio, z: vel.z * ratio },
          true
        )
      }
    })
  })

const Wonkynoid = (app: App) =>
  app
    .registerComponent(ConstantVelocity)
    .use(Bricks)
    .use(Floor)
    .use(Walls)
    .use(Player)
    .onStart((app) => {
      setupScene(app)
      setupBall(app)
    })

const app = new App()
  .use(TickerPlugin)
  .use(TransformsPlugin)
  .use(ThreePlugin)
  .use(ThreePostprocessingPlugin)
  .use(InputPlugin)
  .use(Physics.Plugin({ gravity: [0, 0, 0] }))
  .use(ConstantVelocityPlugin)
  .use(Wonkynoid)

app.start()

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      console.log("HMR received")
      app.stop()
    }
  })
}
