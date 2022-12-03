import { Input, InputPlugin } from "@bigby/plugin-input"
import * as Physics from "@bigby/plugin-physics3d"
import { RigidBody } from "@bigby/plugin-physics3d"
import { ThreePlugin } from "@bigby/plugin-three"
import { App, TickerPlugin, Transform, TransformsPlugin } from "bigby"
import * as THREE from "three"
import "./index.css"

class Player {}

class ConstantVelocity {
  constructor(public velocity: number) {}
}

const setupScene = (app: App) => {
  /* Camera */
  app.add([
    new Transform([0, 0, 15]),
    new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
  ])

  /* Lights */
  app.add([new Transform([0, 0, 0]), new THREE.AmbientLight(0xffffff, 0.2)])

  app.add([
    new Transform([10, 20, 30]),
    new THREE.DirectionalLight(0xffffff, 0.8)
  ])
}

const setupPlayer = (app: App) => {
  /* Player */
  app.add([
    new Player(),
    new Input(),

    new Physics.DynamicBody()
      .setEnabledRotations(false, false, true)
      .setEnabledTranslations(true, true, false),

    new Physics.BoxCollider([5, 1, 1]),

    new Transform([0, -8.5, 0]),

    new THREE.Mesh(
      new THREE.BoxGeometry(5, 1, 1),
      new THREE.MeshStandardMaterial({ color: "hotpink" })
    )
  ])

  const playerQuery = app.query([Player])

  app.addSystem(() => {
    const player = playerQuery.first

    if (player) {
      const { move, aim } = player.get(Input)!
      const rigidbody = player.get(Physics.RigidBody)!

      const rb = rigidbody.raw!
      rb.resetForces(false)
      rb.resetTorques(false)

      /* Move */
      rb.applyImpulse({ x: move.x * 2, y: move.y * 2, z: 0 }, true)

      /* Rotate */
      rb.applyTorqueImpulse({ x: 0, y: 0, z: aim.x * -1 }, true)
    }
  })
}

const setupBricks = (app: App) => {
  const material = new THREE.MeshStandardMaterial({ color: "#99c" })
  const geometry = new THREE.BoxGeometry(2, 1, 1)
  const activeMaterial = new THREE.MeshStandardMaterial({ color: "#fff" })

  /* Bricks */
  for (let x = -3; x <= 3; x++) {
    for (let y = -2; y <= 2; y++) {
      app.add([
        new Physics.DynamicBody().setEnabledTranslations(true, true, false),

        new Physics.BoxCollider([2, 1, 1])
          .setDensity(2)
          .onCollisionStart((other) => {
            console.log("OH NO")
          }),
        new Transform([x * 3, y * 2 + 2, 0]),

        new THREE.Mesh(geometry, material)
      ])
    }
  }
}

const setupWalls = (app: App) => {
  /* North Wall */
  app.add([
    new Physics.StaticBody(),
    new Physics.BoxCollider([25, 1, 1]).setDensity(0),
    new Transform([0, 8.5, 0]),
    new THREE.Mesh(
      new THREE.BoxGeometry(24, 1, 1),
      new THREE.MeshStandardMaterial({ color: "#999" })
    )
  ])

  /* West Wall */
  app.add([
    new Physics.StaticBody(),
    new Physics.BoxCollider([1, 21, 1]).setDensity(0),
    new Transform([-12.5, 0, 0]),
    new THREE.Mesh(
      new THREE.BoxGeometry(1, 18, 1),
      new THREE.MeshStandardMaterial({ color: "#999" })
    )
  ])

  /* East Wall */
  app.add([
    new Physics.StaticBody(),
    new Physics.BoxCollider([1, 21, 1]).setDensity(0),
    new Transform([+12.5, 0, 0]),
    new THREE.Mesh(
      new THREE.BoxGeometry(1, 18, 1),
      new THREE.MeshStandardMaterial({ color: "#999" })
    )
  ])

  /* South (Death) Wall */
  app.add([
    new Physics.StaticBody(),
    new Physics.BoxCollider([27, 1, 1]).setDensity(0),
    new Transform([0, -9.5, 0])
  ])
}

const setupBall = (app: App) => {
  /* Ball */
  const ball = app.add([
    new Physics.DynamicBody().setEnabledTranslations(true, true, false),
    new Transform([0, -5, 0]),
    new Physics.BallCollider(0.5).setDensity(1),
    new ConstantVelocity(10),
    new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.6, 0),
      new THREE.MeshStandardMaterial({ color: "white" })
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
  app.addStartupSystem((app) => {
    const query = app.query([ConstantVelocity, RigidBody])

    app.addSystem(() => {
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
    .registerComponent(Player)
    .registerComponent(ConstantVelocity)
    .addStartupSystem((app) => {
      setupScene(app)
      setupWalls(app)
      setupPlayer(app)
      setupBricks(app)
      setupBall(app)
    })

const app = new App()
  .use(TickerPlugin)
  .use(TransformsPlugin)
  .use(ThreePlugin)
  .use(InputPlugin)
  .use(Physics.Plugin({ gravity: [0, 0, 0] }))
  .use(ConstantVelocityPlugin)
  .use(Wonkynoid)
  .start()

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      console.log("HMR received")
      app.stop()
    }
  })
}
