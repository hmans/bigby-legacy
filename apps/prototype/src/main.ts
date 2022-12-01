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
