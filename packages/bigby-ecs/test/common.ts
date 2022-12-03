import { World } from "../src"

export class Position {
  constructor(public x = 0, public y = 0) {}
}

export class Velocity {
  constructor(public x = 0, public y = 0) {}
}

export class Health {
  constructor(public current = 100, public max = current) {}
}

export const createWorldWithComponents = () =>
  new World()
    .registerComponent(Position)
    .registerComponent(Velocity)
    .registerComponent(Health)
