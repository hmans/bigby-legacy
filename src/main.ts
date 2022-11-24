import "./style.css"

import { Renderer, Camera, Object3D, Geometry, Mesh } from "./four/four"
import { OrbitControls } from "./four/OrbitControls"
import { WireframeMaterial } from "./four/WireframeMaterial"
import { BasicMaterial } from "./four/BasicMaterial"
// import { OrbitControls } from './OrbitControls'

const renderer = new Renderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.canvas)

const camera = new Camera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position[2] = 5

const controls = new OrbitControls(camera)
controls.connect(renderer.canvas)

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
    })
  }
}

const pink = new Mesh(new BoxGeometry(), new BasicMaterial([1.0, 0.3, 0.9]))
pink.position[0] = -1
scene.add(pink)

const green = new Mesh(
  new BoxGeometry(),
  new WireframeMaterial([0.2, 1.0, 0.6])
)
green.position[0] = 0
scene.add(green)

const blue = new Mesh(new BoxGeometry(), new WireframeMaterial([0.5, 0.8, 1.0]))
blue.position[0] = 1
scene.add(blue)

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
})

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()
