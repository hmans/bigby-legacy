import { World } from "../src/World"
import { Query } from "../src/Query"
import { Position, Velocity, Health, createWorldWithComponents } from "./common"

describe(World, () => {
  it("should create a world", () => {
    const world = new World()
    expect(world).toBeInstanceOf(World)
  })

  describe("use", () => {
    it("executes the given function, passing itself to it", () => {
      const world = new World()
      const fn = jest.fn()
      world.use(fn)
      expect(fn).toHaveBeenCalledWith(world)
    })

    it("returns itself", () => {
      const world = new World()
      const fn = jest.fn()
      const result = world.use(fn)
      expect(result).toBe(world)
    })

    describe("if the plugin was already used previously", () => {
      it("does not execute the given function", () => {
        const world = new World()
        const fn = jest.fn()
        world.use(fn)
        world.use(fn)
        expect(fn).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe("spawn", () => {
    it("creates an entity with the given components", () => {
      const world = createWorldWithComponents()

      const position = new Position()
      const velocity = new Velocity()
      const health = new Health()

      const entity = world.spawn([position, velocity, health])

      expect(entity).toBeDefined()
      expect(entity.components[0]).toBe(position)
      expect(entity.components[1]).toBe(velocity)
      expect(entity.components[2]).toBe(health)
    })

    it("accepts the constructors and will automatically instantiate them", () => {
      const world = createWorldWithComponents()

      const entity = world.spawn([Position, Velocity, Health])

      expect(entity.components[0]).toBeInstanceOf(Position)
      expect(entity.components[1]).toBeInstanceOf(Velocity)
      expect(entity.components[2]).toBeInstanceOf(Health)
    })

    it("adds the entity to all relevant queries", () => {
      const world = createWorldWithComponents()

      const position = new Position()
      const velocity = new Velocity()
      const health = new Health()

      const query = world.query([Position, Velocity])

      const entity = world.spawn([position, velocity, health])

      expect(query.entities).toContain(entity)
      expect(query.components.get(entity)).toEqual([position, velocity])
    })

    it("throws an error if any of the given components has not been registered previously", () => {
      const world = new World()
      expect(() => world.spawn([new Position()])).toThrow()
    })
  })

  describe("destroy", () => {
    it("removes the entity from the world", () => {
      const world = createWorldWithComponents()

      const entity = world.spawn([new Position()])
      expect(world.entities).toHaveLength(1)

      world.destroy(entity)
      expect(world.entities).toHaveLength(0)
    })

    it("removes the entity from all relevant queries", () => {
      const world = createWorldWithComponents()

      const position = new Position()
      const velocity = new Velocity()
      const health = new Health()

      const query = world.query([Position, Velocity])

      const entity = world.spawn([position, velocity, health])

      expect(query.entities).toContain(entity)
      expect(query.components.get(entity)).toEqual([position, velocity])

      world.destroy(entity)

      expect(query.entities).not.toContain(entity)
      expect(query.components.get(entity)).toBeUndefined()
    })
  })

  describe("registerComponent", () => {
    it("registers the given components", () => {
      const world = new World()
      world.registerComponent(Position)

      /* Using this component will not throw an error */
      expect(() => world.spawn([new Position()])).not.toThrow()

      /* Using another component will throw an error. */
      expect(() => world.spawn([new Velocity()])).toThrow()
    })

    it("works with child classes", () => {
      class A {}
      class B extends A {}

      const world = new World()
      world.registerComponent(A)

      expect(() => world.spawn([new B()])).not.toThrow()
    })
  })

  describe("addComponent", () => {
    it("adds the given component to the entity", () => {
      const world = createWorldWithComponents()

      const position = new Position()
      const entity = world.spawn([position])
      expect(entity.components).toEqual([position])

      const velocity = new Velocity()
      world.addComponent(entity, velocity)
      expect(entity.components).toEqual([position, velocity])
    })

    it("adds the entity from all relevant queries", () => {
      const world = createWorldWithComponents()

      const position = new Position()
      const velocity = new Velocity()
      const health = new Health()

      const query = world.query([Position, Velocity])

      const entity = world.spawn([position, health])

      expect(query.entities).not.toContain(entity)

      world.addComponent(entity, velocity)

      expect(query.entities).toContain(entity)
      expect(query.components.get(entity)).toEqual([position, velocity])
    })

    it("emits the onEntityUpdated event", () => {
      const world = createWorldWithComponents()

      const entity = world.spawn([new Position()])

      const spy = jest.fn()
      world.onEntityUpdated.add(spy)
      world.addComponent(entity, new Velocity())
      expect(spy).toHaveBeenCalledWith(entity)
    })

    it("returns true if the component was added successfully", () => {
      const world = createWorldWithComponents()

      const entity = world.spawn([new Position()])
      expect(world.addComponent(entity, new Velocity())).toBe(true)
    })

    it("returns false when the entity already has a component of the same type", () => {
      const world = createWorldWithComponents()

      const entity = world.spawn([new Position()])
      expect(world.addComponent(entity, new Position())).toBe(false)
    })

    it("throws an error when the given component has not been registered first", () => {
      const world = new World()

      const entity = world.spawn([])
      expect(() => world.addComponent(entity, new Health())).toThrow()
    })
  })

  describe("removeComponent", () => {
    it("removes the specified component from the entity", () => {
      const world = createWorldWithComponents()

      const position = new Position()
      const velocity = new Velocity()
      const entity = world.spawn([position, velocity])
      expect(entity.components).toEqual([position, velocity])

      world.removeComponent(entity, velocity)
      expect(entity.components).toEqual([position])
    })

    it("removes the component of the given type from the entity", () => {
      const world = createWorldWithComponents()

      const position = new Position()
      const velocity = new Velocity()
      const entity = world.spawn([position, velocity])
      expect(entity.components).toEqual([position, velocity])

      world.removeComponent(entity, Velocity)
      expect(entity.components).toEqual([position])
    })

    describe("when it removes a component successfully", () => {
      it("removes the entity from all relevant queries", () => {
        const world = createWorldWithComponents()

        const position = new Position()
        const velocity = new Velocity()
        const health = new Health()

        const query = world.query([Position, Velocity])

        const entity = world.spawn([position, velocity, health])

        expect(query.entities).toContain(entity)
        expect(query.components.get(entity)).toEqual([position, velocity])

        world.removeComponent(entity, velocity)

        expect(query.entities).not.toContain(entity)
        expect(query.components.get(entity)).toBeUndefined()
      })

      it("emits the onEntityUpdated event when a component has been removed successfully", () => {
        const world = createWorldWithComponents()
        const entity = world.spawn([new Position(), new Velocity()])
        const spy = jest.fn()

        world.onEntityUpdated.add(spy)
        world.removeComponent(entity, Velocity)

        expect(spy).toHaveBeenCalledWith(entity)
      })

      it("returns true", () => {
        const world = createWorldWithComponents()
        const entity = world.spawn([new Position(), new Velocity()])
        expect(world.removeComponent(entity, Velocity)).toBe(true)
      })
    })

    describe("when it doesn't remove a component", () => {
      it("does not emit the event", () => {
        const world = createWorldWithComponents()
        const entity = world.spawn([new Position()])
        const spy = jest.fn()

        world.onEntityUpdated.add(spy)
        world.removeComponent(entity, Velocity)

        expect(spy).not.toHaveBeenCalled()
      })

      it("returns false", () => {
        const world = createWorldWithComponents()
        const entity = world.spawn([new Position()])
        expect(world.removeComponent(entity, Velocity)).toBe(false)
      })
    })
  })

  describe("getSingletonComponent", () => {
    it("returns the singleton component", () => {
      const world = createWorldWithComponents()

      const singleton = new Position()
      world.spawn([singleton])

      expect(world.getSingletonComponent(Position)).toBe(singleton)
    })

    it("returns undefined if no entity with the component can be found", () => {
      const world = createWorldWithComponents()
      expect(world.getSingletonComponent(Position)).toBeUndefined()
    })

    it("throws an error when the given component has not been registered first", () => {
      const world = new World()
      expect(() => world.getSingletonComponent(Position)).toThrow()
    })
  })

  describe("query", () => {
    it("creates a Query object", () => {
      const world = createWorldWithComponents()
      const query = world.query([Position, Velocity, Health])
      expect(query).toBeInstanceOf(Query)
    })

    it("returns the same query objects for identical queries", () => {
      const world = createWorldWithComponents()
      const query1 = world.query([Position, Velocity, Health])
      const query2 = world.query([Position, Velocity, Health])
      expect(query1).toBe(query2)
    })

    it("throws an error if any of the queried components has not been registered previously", () => {
      const world = new World().registerComponent(Position)
      expect(() => world.query([Position, Health])).toThrow()
    })
  })
})
