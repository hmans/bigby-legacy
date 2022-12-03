import { World } from "@bigby/ecs"
import {
  InitCallback,
  Plugin,
  StartCallback,
  StopCallback,
  UpdateCallback
} from "./types"

export type BaseEntity = {}

export class App extends World {
  systems = new Array<UpdateCallback>()
  initializers = new Array<InitCallback>()
  startupSystems = new Array<StartCallback>()
  stopCallbacks = new Array<StopCallback>()

  constructor() {
    console.log("🐝 Bigby Initializing")
    super()
  }

  use(plugin: Plugin): App {
    return plugin(this as any)
  }

  onInit(system: InitCallback) {
    this.initializers.push(system)
    return this
  }

  onStart(system: StartCallback) {
    this.startupSystems.push(system)
    return this
  }

  onUpdate(system: UpdateCallback) {
    this.systems.push(system)
    return this
  }

  onStop(callback: StopCallback) {
    this.stopCallbacks.push(callback)
    return this
  }

  start() {
    console.log("✅ Starting App")

    /* Execute and wait for initializers to complete */
    Promise.all(this.initializers.map((system) => system())).then(() => {
      this.startupSystems.forEach((system) => system(this))
    })

    return this
  }

  stop() {
    console.log("⛔ Stopping App")
    this.stopCallbacks.forEach((callback) => callback(this))
    return this
  }
}
