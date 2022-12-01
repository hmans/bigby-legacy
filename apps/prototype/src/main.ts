import { App, TickerPlugin } from "bigby"
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

new App()
  .addPlugin(TickerPlugin)

  /* Movement */
  .addStartupSystem((app) => {
    const moving = app.world.query([Position, Velocity])

    app.addSystem((dt) => {
      moving.iterate((entity, [position, velocity]) => {
        position.x += velocity.x * dt
        position.y += velocity.y * dt
      })
    })
  })

  /* Game initialization */
  .addStartupSystem((app) => {
    console.log("hello world")
    app.world.add([new Position(), new Velocity()])
  })

  .run()
