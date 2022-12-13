import {
  AnimationFrameTicker,
  App,
  FunctionSystem,
  make,
  Stage,
  System,
} from "bigby"
import {
  DirectionalLight,
  IcosahedronGeometry,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
} from "three"
import { ThreePlugin } from "../../../packages/bigby-plugin-three/src"
import "./style.css"

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/* Set up the application */
const app = new App()
app.use(AnimationFrameTicker)

app.use(() => {
  console.log("Starting up!")

  app.spawn([
    new FunctionSystem(app, (dt) => {
      console.log("tick")
    }),
    Stage.Update,
  ])

  return () => {
    console.log("shutting down!")
  }
})

await wait(1000)

app.dispose()

// app.use(ThreePlugin)

// /* Add a silly little system, just for fun */
// class RotatesAllMeshesSystem extends System {
//   speed = 1

//   protected meshes = this.app.query([Mesh])

//   onUpdate(dt: number) {
//     for (const [_, mesh] of this.meshes) {
//       mesh.rotation.x += dt * this.speed
//       mesh.rotation.y += dt * this.speed
//     }
//   }
// }

// app.addSystem(RotatesAllMeshesSystem, { speed: 1 })

// /* Set up the scene */
// app.spawn([make(DirectionalLight, { position: [1, 2, 3] })])

// app.spawn([
//   make(PerspectiveCamera, {
//     args: [75, window.innerWidth / window.innerHeight, 0.1, 1000],
//     position: [0, 0, 5],
//   }),
// ])

// app.spawn([
//   make(Mesh, {
//     geometry: make(IcosahedronGeometry),
//     material: make(MeshStandardMaterial),
//   }),
// ])

// app.start()

// function wait(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms))
// }

// // await wait(1000)

// // app.stop()
