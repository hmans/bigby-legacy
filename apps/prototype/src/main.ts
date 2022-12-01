import { vec3 } from "gl-matrix"
import "./style.css"

class Transform {
  isTransform = true

  constructor(
    public position = vec3.create(),
    public quaternion = vec3.create(),
    public scale = vec3.set(vec3.create(), 1, 1, 1)
  ) {}
}

class AutoRotate {
  isAutorotate = true
  constructor() {}
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

  constructor(public world: World<C>, query: { [K in keyof Q]: Constructor<Q[K]> }) {
    for (const entity of world.entities) {
      const subentity = entity.filter((component) =>
        query.some((ctor) => component instanceof ctor)
      )

      if (subentity.length) {
        this.entities.push(entity)
        this.components.set(entity, subentity)
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

/* Dummy system */
console.log("Complete entity:")
for (const entity of world.entities) {
  console.log(entity)
}

console.log("Just Autorotate:")

const query = new Query(world, [Transform, AutoRotate] as const)

query.iterate((entity, [transform, autoRotate]) => {
  console.log(autoRotate)
})
