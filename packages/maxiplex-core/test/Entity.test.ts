import { Entity } from "../src/Entity"
import { createWorldWithComponents, Position } from "./common"

describe(Entity, () => {
  it("is the class driving entities created in a world", () => {
    const world = createWorldWithComponents()
    const entity = world.spawn()
    expect(entity).toBeInstanceOf(Entity)
  })

  it("can add components to itself", () => {
    const world = createWorldWithComponents()
    const entity = world.spawn()
    entity.add(new Position(0, 0))
    expect(entity.get(Position)).toBeInstanceOf(Position)
    expect(world.query([Position])).toEqual([entity])
  })
})
