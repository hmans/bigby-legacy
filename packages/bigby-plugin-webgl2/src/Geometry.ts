import { Attribute } from "./Attribute"

export class Geometry {
  readonly attributes: Record<string, Attribute> = {}

  constructor(attributes: Record<string, Attribute>) {
    for (const key in attributes) {
      this.attributes[key] = attributes[key]
      this.attributes[key].needsUpdate = true
    }
  }
}
