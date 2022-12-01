import { quat, vec3 } from "gl-matrix"
import "./style.css"
import { type Function } from "ts-toolbelt"

class Transform {
  isTransform = true

  constructor(
    public position = vec3.create(),
    public quaternion = quat.create(),
    public scale = vec3.set(vec3.create(), 1, 1, 1)
  ) {}
}

class AutoRotate {
  isAutorotate = true
  constructor(public speed = 1) {}
}

class Unrelated {
  poop = "moo"
}

export type Entity<C> = C[]

class World<C> {
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
}

type Constructor<T> = new (...args: any[]) => T

class Query<Q extends readonly C[], C> {
  entities = new Array<Entity<C>>()
  components = new Map<Entity<C>, Q>()

  constructor(
    public world: World<C>,
    query: Function.Narrow<{ [K in keyof Q]: Constructor<Q[K]> }>
  ) {
    for (const entity of world.entities) {
      const subentity: C[] = []

      query.forEach((component) => {
        const found = entity.find((c) => c instanceof component)
        if (found) subentity.push(found)
      })

      if (subentity.length) {
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

const world = new World<Transform | AutoRotate>()

world.spawn([new Transform(), new AutoRotate()])

console.log("Complete entity:")
for (const entity of world.entities) {
  console.log(entity)
}

console.log("AutoRotate:")
const query = new Query(world, [AutoRotate, Transform])
query.iterate((entity, [autoRotate, transform]) => {
  console.log(transform)
  quat.rotateY(transform.quaternion, transform.quaternion, autoRotate.speed)
})
