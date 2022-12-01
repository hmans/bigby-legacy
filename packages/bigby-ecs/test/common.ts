export class Position {
  constructor(public x = 0, public y = 0) {}
}

export class Velocity {
  constructor(public x = 0, public y = 0) {}
}

export class Health {
  constructor(public current = 100, public max = current) {}
}
