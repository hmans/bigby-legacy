import { Function } from "ts-toolbelt"

export type Entity<C> = C[]

type Constructor<T> = new (...args: any[]) => T

export class World<C> {
  constructor() {}

  entities = new Array<C[]>()

  spawn(entity: Entity<C>) {
    this.entities.push(entity)
    return entity
  }

  despawn(entity: Entity<C>) {
    /* Remove entity */
    const index = this.entities.indexOf(entity)
    if (index !== -1) this.entities.splice(index, 1)

    return entity
  }

  insert(entity: Entity<C>) {
    return entity
  }

  remove(entity: Entity<C>) {
    return entity
  }

  query<Q extends readonly C[]>(
    query: Function.Narrow<{ [K in keyof Q]: Constructor<Q[K]> }>
  ) {
    return new Query<Q, C>(this, query)
  }
}

export class Query<Q extends readonly C[], C> {
  entities = new Array<Entity<C>>()
  components = new Map<Entity<C>, Q>()

  constructor(
    public world: World<C>,
    query: Function.Narrow<{ [K in keyof Q]: Constructor<Q[K]> }>
  ) {
    for (const entity of world.entities) {
      const subentity: C[] = []

      /* Collect components */
      query.forEach((component) => {
        const found = entity.find((c) => c instanceof component)
        if (found) subentity.push(found)
      })

      if (subentity.length === query.length) {
        this.entities.push(entity)
        this.components.set(entity, subentity as unknown as Q)
      }
    }
  }

  iterate(fun: (entity: Entity<C>, components: Q) => void) {
    for (const entity of this.entities) {
      fun(entity, this.components.get(entity)!)
    }
  }
}
