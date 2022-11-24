import { Game } from "./bigby/game"
import * as THREE from "three"
import "./style.css"
import { DodecahedronGeometry, MeshBasicMaterial } from "three"

const game = new Game()
game.start()

game.scene.add(
  new THREE.Mesh(
    new DodecahedronGeometry(),
    new MeshBasicMaterial({ color: "red" })
  )
)

game.update()
