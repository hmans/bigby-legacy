import "./style.css"

import { Camera } from "./four/Camera"
import { LitMaterial } from "./four/materials/LitMaterial"
import { Mesh } from "./four/Mesh"
import { Object3D } from "./four/Object3D"
import { OrbitControls } from "./four/OrbitControls"
import { Renderer } from "./four/Renderer"
import { BoxGeometry } from "./four/BoxGeometry"

/* Create a renderer */
const renderer = new Renderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.canvas)

/* Create a camera */
const camera = new Camera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position[2] = 5

/* Create and attach orbit controls */
const controls = new OrbitControls(camera)
controls.connect(renderer.canvas)

/* Create a scene */
const scene = new Object3D()

const pink = new Mesh(new BoxGeometry(), new LitMaterial([1.0, 0.3, 0.9]))
// pink.position[0] = -1
scene.add(pink)

const green = new Mesh(new BoxGeometry(), new LitMaterial([0.3, 0.9, 0.3]))
green.scale[0] = 5
green.scale[1] = 5
green.scale[2] = 5
green.position[2] = -10
scene.add(green)

// const green = new Mesh(
//   new BoxGeometry(),
//   new WireframeMaterial([0.2, 1.0, 0.6])
// )
// green.position[0] = 0
// scene.add(green)

// const blue = new Mesh(new BoxGeometry(), new WireframeMaterial([0.5, 0.8, 1.0]))
// blue.position[0] = 1
// scene.add(blue)

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
})

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()
