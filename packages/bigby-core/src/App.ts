import { NonAbstractConstructor, World } from "@maxiplex/core"
import { System } from "./System"
import { SystemsPlugin } from "./SystemsPlugin"

export class App extends World {
  constructor() {
    super()
    console.log("🐝 Bigby Initializing")
    this.use(SystemsPlugin)
  }

  addSystem<S extends System>(
    ctor: NonAbstractConstructor<S>,
    props: Partial<S> = {}
  ) {
    const system = new ctor(this)
    Object.assign(system, props)
    this.spawn([system])
    return this
  }
}
