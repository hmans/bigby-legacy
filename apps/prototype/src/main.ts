import { World } from "bigby"
import "./style.css"

class Position {
  constructor(public x = 0, public y = 0) {}
}

class Velocity {
  constructor(public x = 0, public y = 0) {}
}

class Health {
  constructor(public current = 100, public max = current) {}
}

const world = new World()

world.add([new Position(), new Velocity(), new Health()])

const query = world.query([Position, Velocity])
