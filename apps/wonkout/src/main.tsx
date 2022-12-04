import { Input, InputPlugin } from "@bigby/plugin-input"
import * as Physics from "@bigby/plugin-physics3d"
import { RigidBody } from "@bigby/plugin-physics3d"
import { ThreePlugin } from "@bigby/plugin-three"
import { ThreePostprocessingPlugin } from "@bigby/plugin-three-postprocessing"
import {
  App,
  Component,
  Constructor,
  TickerPlugin,
  Transform3D,
  TransformsPlugin
} from "bigby"
import * as THREE from "three"
import "./index.css"

/* TODO: extract this into maxiplex */
const apply = <C extends object>(component: C, props: Partial<C>) => {
  Object.assign(component, props)
  return component
}

const component = <C extends object>(
  ctor: Constructor<C>,
  props: Partial<C>
): C => {
  // @ts-ignore
  const instance = new ctor()
  return apply(instance, props)
}

class Player {}

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

const setupFloor = (app: App) => {
  app.add([
    component(Transform3D, { position: [0, 0, -2] }),
    component(THREE.Mesh, {
      receiveShadow: true,
      geometry: new THREE.PlaneGeometry(100, 100),
      material: new THREE.MeshStandardMaterial({ color: "#555" })
    })
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

    new Transform3D([0, -8.5, 0]),

    component(THREE.Mesh, {
      geometry: new THREE.BoxGeometry(5, 1, 1),
      material: new THREE.MeshStandardMaterial({
        color: "hotpink",
        emissive: "hotpink",
        emissiveIntensity: 0.8
      }),
      castShadow: true
    })
  ])

  const playerQuery = app.query([Player])

  app.onUpdate(() => {
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
  const material = new THREE.MeshStandardMaterial({ color: "orange" })
  const geometry = new THREE.BoxGeometry(2, 1, 1)
  const activeMaterial = new THREE.MeshStandardMaterial({ color: "#fff" })

  /* Bricks */
  for (let x = -3; x <= 3; x++) {
    for (let y = -2; y <= 2; y++) {
      const mesh = new THREE.Mesh(geometry, material)
      mesh.castShadow = true
      mesh.receiveShadow = true

      app.add([
        new Physics.DynamicBody().setEnabledTranslations(true, true, false),

        new Physics.BoxCollider([2, 1, 1])
          .setDensity(2)
          .onCollisionStart((other) => {
            console.log("OH NO")
          }),
        new Transform3D([x * 3, y * 2 + 2, 0]),

        mesh
      ])
    }
  }
}

const setupWalls = (app: App) => {
  const height = 4
  /* North Wall */
  app.add([
    new Physics.StaticBody(),
    new Physics.BoxCollider([24, 1, height]).setDensity(0),
    new Transform3D([0, 8.5, 0]),
    component(THREE.Mesh, {
      geometry: new THREE.BoxGeometry(24, 1, height),
      material: new THREE.MeshStandardMaterial({ color: "#999" }),
      castShadow: true
    })
  ])

  /* West Wall */
  app.add([
    new Physics.StaticBody(),
    new Physics.BoxCollider([1, 18, height]).setDensity(0),
    new Transform3D([-12.5, 0, 0]),
    apply(
      new THREE.Mesh(
        new THREE.BoxGeometry(1, 18, height),
        new THREE.MeshStandardMaterial({ color: "#999" })
      ),
      { castShadow: true }
    )
  ])

  /* East Wall */
  app.add([
    new Physics.StaticBody(),
    new Physics.BoxCollider([1, 18, height]).setDensity(0),
    new Transform3D([+12.5, 0, 0]),
    apply(
      new THREE.Mesh(
        new THREE.BoxGeometry(1, 18, height),
        new THREE.MeshStandardMaterial({ color: "#999" })
      ),
      { castShadow: true }
    )
  ])

  /* South (Death) Wall */
  app.add([
    new Physics.StaticBody(),
    new Physics.BoxCollider([27, 1, 1]).setDensity(0),
    new Transform3D([0, -9.5, 0])
  ])
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
    .registerComponent(Player)
    .registerComponent(ConstantVelocity)
    .onStart((app) => {
      setupScene(app)
      setupFloor(app)
      setupWalls(app)
      setupPlayer(app)
      setupBricks(app)
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
