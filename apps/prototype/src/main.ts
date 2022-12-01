import { ThreePlugin } from "@bigby/plugin-three"
import {
  App,
  AutoRotate,
  AutorotatePlugin,
  TickerPlugin,
  Transform,
  TransformsPlugin,
} from "bigby"
import * as THREE from "three"
import "./style.css"

new App()
  .addPlugin(TickerPlugin)
  .addPlugin(TransformsPlugin)
  .addPlugin(ThreePlugin) // 👍
  .addPlugin(AutorotatePlugin)
  .addStartupSystem((app) => {
    /* Camera */
    app.world.add([
      new Transform([0, 0, 10]),
      new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      ),
    ])

    /* Rotating cube */
    app.world.add([
      new AutoRotate([1, 2, 3]),
      new Transform(),
      new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      ),
    ])
  })
  .run()
