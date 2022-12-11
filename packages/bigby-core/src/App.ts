import { World } from "@maxiplex/core"
import { System, SystemCallback } from "./System"
import { SystemsPlugin } from "./SystemsPlugin"
import { NormalUpdate, UpdateStage } from "./UpdateStage"

export class App extends World {
  constructor() {
    super()
    console.log("🐝 Bigby Initializing")
    this.use(SystemsPlugin)
  }

  addSystem(fn: SystemCallback, stage: UpdateStage = NormalUpdate) {
    return this.spawn([new System(this, fn), stage])
  }
}
