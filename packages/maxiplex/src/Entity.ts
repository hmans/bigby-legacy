import { Component, Constructor } from "./types"

export class Entity {
  components = new Array<Component>()

  get<C extends Component>(type: Constructor<C>): C | undefined {
    return this.components.find((c) => c instanceof type)
  }
}
