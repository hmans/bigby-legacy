import { createReactAPI } from "@bigby/react"
import { App, TickerPlugin } from "bigby"

class FrameCount {
  count = 0
}

export const app = await new App()
  .addPlugin(TickerPlugin)
  .addStartupSystem((app) => {
    const query = app.world.query([FrameCount])

    app.addSystem(() => {
      query.iterate((_, [{ count }]) => count++)
    })
  })
  .run()

export const ECS = createReactAPI(app)
