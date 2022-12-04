import { Event } from "@bigby/event"
import { Entity } from "./Entity"
import { Component, ComponentQuery } from "./index"
import { World } from "./World"

export class Query<Q extends readonly Component[]> {
  /* Custom iterator that iterates over all entities in reverse order. */
  [Symbol.iterator]() {
    let index = this.entities.length

    const result = {
      value: undefined! as [Entity, ...Q],
      done: false
    }

    return {
      next: () => {
        const entity = this.entities[--index]

        if (entity) {
          const components = this.components.get(entity)!
          result.value = [entity, ...components]
        }

        result.done = index < 0
        return result
      }
    }
  }

  entities = new Array<Entity>()
  components = new Map<Entity, Q>()

  onEntityAdded = new Event<Entity>()
  onEntityRemoved = new Event<Entity>()

  get first() {
    return this.entities[0]
  }

  constructor(public world: World, public query: ComponentQuery<Q>) {
    for (const entity of world.entities) {
      this.evaluate(entity)
    }

    world.onEntityAdded.add((entity) => {
      this.evaluate(entity)
    })

    world.onEntityUpdated.add((entity) => {
      this.evaluate(entity)
    })

    world.onEntityRemoved.add((entity) => {
      this.remove(entity)
    })
  }

  iterate(fun: (entity: Entity, ...components: Q) => void) {
    for (const result of this) {
      fun(...result)
    }
  }

  evaluate(entity: Entity) {
    const subentity: any[] = []

    /* Collect components */
    this.query.forEach((component) => {
      const found = entity.components.find((c) => c instanceof component)
      if (found) subentity.push(found)
    })

    const wants = subentity.length === this.query.length
    const has = this.components.has(entity)

    if (wants && !has) {
      this.entities.push(entity)
      this.components.set(entity, subentity as unknown as Q)
      this.onEntityAdded.emit(entity)
    } else if (!wants && has) {
      this.remove(entity)
    }
  }

  protected remove(entity: Entity) {
    const index = this.entities.indexOf(entity)
    if (index !== -1) {
      this.entities.splice(index, 1)
      this.components.delete(entity)
      this.onEntityRemoved.emit(entity)
    }
  }
}
