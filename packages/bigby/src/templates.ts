import { App, TransformsPlugin } from "@bigby/core"
import { TickerPlugin } from "@bigby/ticker"
import { WebGL2RenderingPlugin } from "@bigby/webgl2"

export const WebGL2Game = (app: App) =>
  app
    .addPlugin(TickerPlugin)
    .addPlugin(TransformsPlugin)
    .addPlugin(WebGL2RenderingPlugin)
