import { Event } from "@hmans/event"
import { Entity } from "./Entity"
import { Query } from "./Query"
import { Component, Constructor, ComponentQuery } from "./types"

export class World {
  constructor() {}

  entities = new Array<Entity>()

  onEntityAdded = new Event<Entity>()
  onEntityRemoved = new Event<Entity>()
  onEntityUpdated = new Event<Entity>()

  protected queries = new Map<string, Query<any>>()

  add(components: Component[]) {
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

  addComponent(entity: Entity, component: Component) {
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

  getComponent<T extends Component>(entity: Entity, component: Constructor<T>) {
    return entity.components.find((c) => c.constructor === component) as
      | T
      | undefined
  }

  query<Q extends readonly Component[]>(query: ComponentQuery<Q>): Query<Q> {
    /* Memoize query instances */
    /* TODO: find a better way to build a key */
    const key = query.toString()

    if (!this.queries.has(key)) {
      this.queries.set(key, new Query<Q>(this, query))
    }

    return this.queries.get(key)!
  }
}
