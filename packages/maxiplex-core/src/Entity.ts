import type { World } from "./World"
import type { Component, AbstractConstructor } from "./types"
import { processComponent } from "./helpers"

export class Entity {
  components = new Array<Component>()

  constructor(public world: World) {}

  get<C extends Component>(type: AbstractConstructor<C>): C | undefined {
    return this.components.find((c) => c instanceof type)
  }

  add(component: Component | AbstractConstructor<Component>) {
    return this.world.addComponent(this, processComponent(component))
  }

  remove(type: AbstractConstructor<any>): boolean
  remove(component: Component): boolean
  remove(c: AbstractConstructor<any> | Component) {
    return this.world.removeComponent(this, c)
  }
}
