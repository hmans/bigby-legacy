import { createReactAPI } from "@bigby/react"
import { App, TickerPlugin } from "bigby"

/* A stupid simple class that can act as a component: */
export class FrameCount {
  count = 0
}

export const app = new App()
  .use(TickerPlugin)

  /* Write a system that operates on Framecount */
  .onStart((app) => {
    const query = app.query([FrameCount])

    app.onUpdate(() => {
      query.iterate((_, { count }) => count++)
    })
  })

/* Start up */
app.start()

/* Create a React API specific to the app: */
export const ECS = createReactAPI(app)

/* Let's make some components for our... components: */
export const Components = {
  FrameCount: ECS.makeComponent(FrameCount)
}
