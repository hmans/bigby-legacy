import { Event } from "@hmans/event"
import { Function } from "ts-toolbelt"

export type Component = any
export type Entity = Component[]

type ComponentQuery<C extends Component> = Function.Narrow<{
  [K in keyof C]: Constructor<C[K]>
}>

type Constructor<T> = new (...args: any[]) => T

export class World {
  constructor() {}

  entities = new Array<Entity>()

  onEntityAdded = new Event<Entity>()
  onEntityRemoved = new Event<Entity>()
  onEntityUpdated = new Event<Entity>()

  protected queries = new Map<string, Query<any>>()

  add(entity: Entity) {
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
    if (entity.some((c) => c.constructor === component.constructor))
      return false

    /* Add the component to the entity */
    entity.push(component)

    /* Emit the event */
    this.onEntityUpdated.emit(entity)

    return true
  }

  removeComponent(
    entity: Entity,
    component: Component | Constructor<Component>
  ) {
    /* Remove the component from the entity */
    const index = entity.findIndex(
      (c) => c === component || c.constructor === component
    )
    if (index === -1) return false

    /* Remove the component from the entity */
    entity.splice(index, 1)

    /* Emit the onEntityUpdated event */
    this.onEntityUpdated.emit(entity)

    return true
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

export class Query<Q extends readonly Component[]> {
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

  iterate(fun: (entity: Entity, components: Q) => void) {
    for (const entity of this.entities) {
      fun(entity, this.components.get(entity)!)
    }
  }

  evaluate(entity: Entity) {
    const subentity: any[] = []

    /* Collect components */
    this.query.forEach((component) => {
      const found = entity.find((c) => c instanceof component)
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
