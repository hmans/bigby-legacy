import { Input, InputPlugin } from "@bigby/plugin-input"
import * as Physics from "@bigby/plugin-physics3d"
import { ThreePlugin } from "@bigby/plugin-three"
import { App, TickerPlugin, Transform, TransformsPlugin } from "bigby"
import * as THREE from "three"
import "./index.css"

class Player {}

new App()
  .addPlugin(TickerPlugin)
  .addPlugin(TransformsPlugin)
  .addPlugin(ThreePlugin)
  .addPlugin(InputPlugin)
  .addPlugin(Physics.Plugin({ gravity: [0, 0, 0] }))

  .addStartupSystem((app) => {
    /* Camera */
    app.world.add([
      new Transform([0, 0, 15]),
      new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
    ])

    /* Lights */
    app.world.add([
      new Transform([0, 0, 0]),
      new THREE.AmbientLight(0xffffff, 0.2)
    ])

    app.world.add([
      new Transform([10, 20, 30]),
      new THREE.DirectionalLight(0xffffff, 0.8)
    ])

    /* Player */
    app.world.add([
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

    /* Bricks */
    for (let x = -3; x <= 3; x++) {
      for (let y = -2; y <= 2; y++) {
        app.world.add([
          new Physics.DynamicBody().setEnabledTranslations(true, true, false),

          new Physics.BoxCollider([2, 1, 1]).setDensity(5),
          new Transform([x * 3, y * 2 + 2, 0]),

          new THREE.Mesh(
            new THREE.BoxGeometry(2, 1, 1),
            new THREE.MeshStandardMaterial({ color: "#99c" })
          )
        ])
      }
    }

    /* North Wall */
    app.world.add([
      new Physics.StaticBody(),
      new Physics.BoxCollider([25, 1, 1]).setDensity(0),
      new Transform([0, 8.5, 0]),
      new THREE.Mesh(
        new THREE.BoxGeometry(24, 1, 1),
        new THREE.MeshStandardMaterial({ color: "#999" })
      )
    ])

    /* West Wall */
    app.world.add([
      new Physics.StaticBody(),
      new Physics.BoxCollider([1, 21, 1]).setDensity(0),
      new Transform([-12.5, 0, 0]),
      new THREE.Mesh(
        new THREE.BoxGeometry(1, 18, 1),
        new THREE.MeshStandardMaterial({ color: "#999" })
      )
    ])

    /* East Wall */
    app.world.add([
      new Physics.StaticBody(),
      new Physics.BoxCollider([1, 21, 1]).setDensity(0),
      new Transform([+12.5, 0, 0]),
      new THREE.Mesh(
        new THREE.BoxGeometry(1, 18, 1),
        new THREE.MeshStandardMaterial({ color: "#999" })
      )
    ])

    /* South (Death) Wall */
    app.world.add([
      new Physics.StaticBody(),
      new Physics.BoxCollider([27, 1, 1]).setDensity(0),
      new Transform([0, -9.5, 0])
    ])

    /* Ball */
    app.world.add([
      new Physics.DynamicBody().setEnabledTranslations(true, true, false),
      new Transform([0, -5, 0]),
      new Physics.BallCollider(0.5).setDensity(1),
      new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.6, 0),
        new THREE.MeshStandardMaterial({ color: "white" })
      )
    ])

    const playerQuery = app.world.query([Player])

    app.addSystem((app) => {
      const player = playerQuery.first

      if (player) {
        const input = player.get(Input)!
        const rigidbody = player.get(Physics.RigidBody)!

        rigidbody.raw?.resetForces(false)
        rigidbody.raw?.applyImpulse({ ...input, z: 0 }, true)
      }
    })
  })
  .start()
