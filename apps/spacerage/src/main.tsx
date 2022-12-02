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
    app.world.add([
      new Transform([0, 0, 10]),
      new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
    ])

    app.world.add([
      new Transform([0, 0, 0]),
      new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: "hotpink" })
      )
    ])
  })
  .start()
