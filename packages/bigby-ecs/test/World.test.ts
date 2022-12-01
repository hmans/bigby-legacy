import { Query, World } from "../src"

class Position {
  constructor(public x = 0, public y = 0) {}
}

class Velocity {
  constructor(public x = 0, public y = 0) {}
}

class Health {
  constructor(public current = 100, public max = current) {}
}

describe(World, () => {
  it("should create a world", () => {
    const world = new World()
    expect(world).toBeInstanceOf(World)
  })

  describe("add", () => {
    it("creates an entity with the given components", () => {
      const world = new World()

      const position = new Position()
      const velocity = new Velocity()
      const health = new Health()

      const entity = world.add([position, velocity, health])

      expect(entity).toBeDefined()
      expect(entity[0]).toBe(position)
      expect(entity[1]).toBe(velocity)
      expect(entity[2]).toBe(health)
    })
  })

  describe("remove", () => {
    it("removes the entity from the world", () => {
      const world = new World()

      const entity = world.add([new Position()])
      expect(world.entities).toHaveLength(1)

      world.remove(entity)
      expect(world.entities).toHaveLength(0)
    })
  })

  describe("addComponent", () => {
    it("adds the given component to the entity", () => {
      const world = new World()

      const position = new Position()
      const entity = world.add([position])
      expect(entity).toEqual([position])

      const velocity = new Velocity()
      world.addComponent(entity, velocity)
      expect(entity).toEqual([position, velocity])
    })

    it("emits the onEntityUpdated event", () => {
      const world = new World()

      const entity = world.add([new Position()])

      const spy = jest.fn()
      world.onEntityUpdated.add(spy)
      world.addComponent(entity, new Velocity())
      expect(spy).toHaveBeenCalledWith(entity)
    })

    it("returns true if the component was added successfully", () => {
      const world = new World()

      const entity = world.add([new Position()])
      expect(world.addComponent(entity, new Velocity())).toBe(true)
    })

    it("returns false when the entity already has a component of the same type", () => {
      const world = new World()

      const entity = world.add([new Position()])
      expect(world.addComponent(entity, new Position())).toBe(false)
    })
  })

  describe("removeComponent", () => {
    it("removes the specified component from the entity", () => {
      const world = new World()

      const position = new Position()
      const velocity = new Velocity()
      const entity = world.add([position, velocity])
      expect(entity).toEqual([position, velocity])

      world.removeComponent(entity, velocity)
      expect(entity).toEqual([position])
    })

    it("removes the component of the given type from the entity", () => {
      const world = new World()

      const position = new Position()
      const velocity = new Velocity()
      const entity = world.add([position, velocity])
      expect(entity).toEqual([position, velocity])

      world.removeComponent(entity, Velocity)
      expect(entity).toEqual([position])
    })

    describe("when it removes a component successfully", () => {
      it("emits the onEntityUpdated event when a component has been removed successfully", () => {
        const world = new World()
        const entity = world.add([new Position(), new Velocity()])
        const spy = jest.fn()

        world.onEntityUpdated.add(spy)
        world.removeComponent(entity, Velocity)

        expect(spy).toHaveBeenCalledWith(entity)
      })

      it("returns true", () => {
        const world = new World()
        const entity = world.add([new Position(), new Velocity()])
        expect(world.removeComponent(entity, Velocity)).toBe(true)
      })
    })

    describe("when it doesn't remove a component", () => {
      it("does not emit the event", () => {
        const world = new World()
        const entity = world.add([new Position()])
        const spy = jest.fn()

        world.onEntityUpdated.add(spy)
        world.removeComponent(entity, Velocity)

        expect(spy).not.toHaveBeenCalled()
      })

      it("returns false", () => {
        const world = new World()
        const entity = world.add([new Position()])
        expect(world.removeComponent(entity, Velocity)).toBe(false)
      })
    })
  })

  describe("query", () => {
    it("creates a Query object", () => {
      const world = new World()
      const query = world.query([Position, Velocity, Health])
      expect(query).toBeInstanceOf(Query)
    })
  })
})

describe(Query, () => {
  it("queries the world for entities that have a specific set of components", () => {
    const world = new World()

    const entity = world.add([new Position(), new Velocity()])

    const moving = new Query(world, [Position, Velocity])
    expect(moving.entities).toEqual([entity])

    const withHealth = new Query(world, [Health])
    expect(withHealth.entities).toEqual([])
  })

  describe("iterate", () => {
    it("loops over all entities contained in the query", () => {
      const world = new World()

      world.add([new Position(), new Velocity()])

      const moving = new Query(world, [Position, Velocity])
      moving.iterate((entity, [position, velocity]) => {
        expect(entity).toBeDefined()
        expect(position).toBeInstanceOf(Position)
        expect(velocity).toBeInstanceOf(Velocity)
      })
    })
  })
})
