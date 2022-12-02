import { InputPlugin } from "@bigby/plugin-input"
import { PhysicsPlugin } from "@bigby/plugin-physics3d"
import { ThreePlugin } from "@bigby/plugin-three"
import { App, TickerPlugin, Transform, TransformsPlugin } from "bigby"
import * as THREE from "three"
import "./index.css"

new App()
  .addPlugin(TickerPlugin)
  .addPlugin(TransformsPlugin)
  .addPlugin(ThreePlugin)
  .addPlugin(InputPlugin)
  .addPlugin(PhysicsPlugin)

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
      new Transform([0, -8, 0]),
      new THREE.Mesh(
        new THREE.BoxGeometry(5, 1, 1),
        new THREE.MeshStandardMaterial({ color: "hotpink" })
      )
    ])

    /* Bricks */
    for (let x = -3; x <= 3; x++) {
      for (let y = -2; y <= 2; y++) {
        app.world.add([
          new Transform([x * 3, y * 2 + 2, 0]),

          new THREE.Mesh(
            new THREE.BoxGeometry(2, 1, 1),
            new THREE.MeshStandardMaterial({ color: "#99c" })
          )
        ])
      }
    }
  })
  .start()
