import { App } from "@bigby/core"

export const ThreePlugin = (app: App) =>
  app.addStartupSystem((app) => {
    console.log("hello!")
  })
