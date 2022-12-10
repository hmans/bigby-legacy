import { World } from "@maxiplex/core"
import { System } from "./System"
import { UpdateStage } from "./UpdateStage"

export class App extends World {
  constructor() {
    super()

    console.log("🐝 Bigby Initializing")
    this.registerComponent(System)
    this.registerComponent(UpdateStage)
  }
}
