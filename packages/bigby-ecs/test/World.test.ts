import { World } from "../src"
import { Query } from "../src/Query"
import { Position, Velocity, Health } from "./common"

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
      expect(entity.components[0]).toBe(position)
      expect(entity.components[1]).toBe(velocity)
      expect(entity.components[2]).toBe(health)
    })

    it("adds the entity to all relevant queries", () => {
      const world = new World()

      const position = new Position()
      const velocity = new Velocity()
      const health = new Health()

      const query = world.query([Position, Velocity])

      const entity = world.add([position, velocity, health])

      expect(query.entities).toContain(entity)
      expect(query.components.get(entity)).toEqual([position, velocity])
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

    it("removes the entity from all relevant queries", () => {
      const world = new World()

      const position = new Position()
      const velocity = new Velocity()
      const health = new Health()

      const query = world.query([Position, Velocity])

      const entity = world.add([position, velocity, health])

      expect(query.entities).toContain(entity)
      expect(query.components.get(entity)).toEqual([position, velocity])

      world.remove(entity)

      expect(query.entities).not.toContain(entity)
      expect(query.components.get(entity)).toBeUndefined()
    })
  })

  describe("addComponent", () => {
    it("adds the given component to the entity", () => {
      const world = new World()

      const position = new Position()
      const entity = world.add([position])
      expect(entity.components).toEqual([position])

      const velocity = new Velocity()
      world.addComponent(entity, velocity)
      expect(entity.components).toEqual([position, velocity])
    })

    it("adds the entity from all relevant queries", () => {
      const world = new World()

      const position = new Position()
      const velocity = new Velocity()
      const health = new Health()

      const query = world.query([Position, Velocity])

      const entity = world.add([position, health])

      expect(query.entities).not.toContain(entity)

      world.addComponent(entity, velocity)

      expect(query.entities).toContain(entity)
      expect(query.components.get(entity)).toEqual([position, velocity])
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
      expect(entity.components).toEqual([position, velocity])

      world.removeComponent(entity, velocity)
      expect(entity.components).toEqual([position])
    })

    it("removes the component of the given type from the entity", () => {
      const world = new World()

      const position = new Position()
      const velocity = new Velocity()
      const entity = world.add([position, velocity])
      expect(entity.components).toEqual([position, velocity])

      world.removeComponent(entity, Velocity)
      expect(entity.components).toEqual([position])
    })

    describe("when it removes a component successfully", () => {
      it("removes the entity from all relevant queries", () => {
        const world = new World()

        const position = new Position()
        const velocity = new Velocity()
        const health = new Health()

        const query = world.query([Position, Velocity])

        const entity = world.add([position, velocity, health])

        expect(query.entities).toContain(entity)
        expect(query.components.get(entity)).toEqual([position, velocity])

        world.removeComponent(entity, velocity)

        expect(query.entities).not.toContain(entity)
        expect(query.components.get(entity)).toBeUndefined()
      })

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

    it("returns the same query objects for identical queries", () => {
      const world = new World()
      const query1 = world.query([Position, Velocity, Health])
      const query2 = world.query([Position, Velocity, Health])
      expect(query1).toBe(query2)
    })
  })
})
