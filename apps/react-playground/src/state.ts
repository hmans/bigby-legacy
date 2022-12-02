import { createReactAPI } from "@bigby/react"
import { App, TickerPlugin } from "bigby"

/* A stupid simple class that can act as a component: */
export class FrameCount {
  count = 0
}

export const app = await new App()
  .addPlugin(TickerPlugin)

  /* Write a system that operates on Framecount */
  .addStartupSystem((app) => {
    const query = app.world.query([FrameCount])

    app.addSystem(() => {
      query.iterate((_, [{ count }]) => count++)
    })
  })

  /* Start up */
  .run()

/* Create a React API specific to the app: */
export const ECS = createReactAPI(app)

/* Let's make some components for our... components: */
export const Components = {
  FrameCount: ECS.makeComponent(FrameCount)
}
