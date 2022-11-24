import "./style.css"

import { Camera, Geometry, Mesh, Object3D, Renderer } from "./four/four"
import { LitMaterial } from "./four/LitMaterial"
import { OrbitControls } from "./four/OrbitControls"

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

// prettier-ignore
class BoxGeometry extends Geometry {
  constructor() {
    super({
      position: {
        size: 3,
        data: new Float32Array([
          0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5,
          -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5,
          -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5,
          -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
        ]),
      },
      index: {
        size: 1,
        data: new Uint32Array([
          0, 2, 1, 2, 3, 1, 4, 6, 5, 6, 7, 5, 8, 10, 9, 10, 11, 9, 12, 14, 13, 14, 15, 13, 16, 18, 17, 18, 19, 17, 20,
          22, 21, 22, 23, 21,
        ]),
      },
      normal: {
        size: 3,
        data: new Float32Array([
          0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5,
          -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5,
          -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5,
          -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
        ])
      }
    })
  }
}

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
