import { Component } from "./types"

export class Entity {
  components = new Array<Component>()

  get(type: Component) {
    return this.components.find((c) => c instanceof type)
  }
}
