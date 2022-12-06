import type { World } from "./World"
import type { Component, Constructor } from "./types"

export class Entity {
  components = new Array<Component>()

  constructor(public world: World) {}

  get<C extends Component>(type: Constructor<C>): C | undefined {
    return this.components.find((c) => c instanceof type)
  }

  add(component: Component) {
    return this.world.addComponent(this, component)
  }

  remove(type: Constructor<any>): boolean
  remove(component: Component): boolean
  remove(c: Constructor<any> | Component) {
    return this.world.removeComponent(this, c)
  }
}
