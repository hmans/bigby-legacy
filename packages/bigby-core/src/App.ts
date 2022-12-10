import { World } from "@maxiplex/core"
import { SystemsPlugin } from "./SystemsPlugin"

export class App extends World {
  constructor() {
    super()
    console.log("🐝 Bigby Initializing")
    this.use(SystemsPlugin)
  }
}
