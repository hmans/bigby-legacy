import { Event } from "@hmans/event"
import { Entity } from "./Entity"
import { Query } from "./Query"
import { Component, Constructor, ComponentQuery } from "./types"

export class World {
  constructor() {}

  entities = new Array<Entity>()
  protected registeredComponents = new Set<Component>()

  onEntityAdded = new Event<Entity>()
  onEntityRemoved = new Event<Entity>()
  onEntityUpdated = new Event<Entity>()

  protected queries = new Map<string, Query<any>>()

  add(components: Component[]) {
    /* Check all given components if they've been registered with us */
    components.forEach((component) => {
      this.assertRegisteredComponent(component.constructor)
    })

    /* Create a new entity */
    const entity = new Entity()
    entity.components.push(...components)

    /* Add the entity to the world */
    this.entities.push(entity)
    this.onEntityAdded.emit(entity)

    return entity
  }

  remove(entity: Entity) {
    /* Remove entity */
    const index = this.entities.indexOf(entity)
    if (index !== -1) {
      this.entities.splice(index, 1)
      this.onEntityRemoved.emit(entity)
    }

    return entity
  }

  registerComponent(...ctors: Constructor<Component>[]) {
    ctors.forEach((ctor) => this.registeredComponents.add(ctor))
    return this
  }

  addComponent(entity: Entity, component: Component) {
    /* Check if the component has been registered with us */
    this.assertRegisteredComponent(component.constructor)

    /* check if the component is already present */
    if (entity.components.some((c) => c.constructor === component.constructor))
      return false

    /* Add the component to the entity */
    entity.components.push(component)

    /* Emit the event */
    this.onEntityUpdated.emit(entity)

    return true
  }

  removeComponent(
    entity: Entity,
    component: Component | Constructor<Component>
  ) {
    /* Remove the component from the entity */
    const index = entity.components.findIndex(
      (c) => c === component || c.constructor === component
    )
    if (index === -1) return false

    /* Remove the component from the entity */
    entity.components.splice(index, 1)

    /* Emit the onEntityUpdated event */
    this.onEntityUpdated.emit(entity)

    return true
  }

  private assertRegisteredComponent(ctor: Constructor<Component>) {
    if (!this.registeredComponents.has(ctor)) {
      throw new Error(
        `Component "${ctor.constructor.name}" unknown. Did you forget to register it first, or add a plugin that does this?`
      )
    }
  }

  query<Q extends readonly Component[]>(query: ComponentQuery<Q>): Query<Q> {
    /* Check if all these components have been registered with us */
    query.forEach((ctor) => this.assertRegisteredComponent(ctor))

    /* Memoize query instances */
    /* TODO: find a better way to build a key */
    const key = query.toString()

    if (!this.queries.has(key)) {
      this.queries.set(key, new Query<Q>(this, query))
    }

    return this.queries.get(key)!
  }
}
