import { App, BaseEntity, TransformsPlugin } from "@bigby/core"
import { WebGL2RenderingPlugin } from "@bigby/webgl2"

export const WebGL2Game = (app: App<BaseEntity>) =>
  app.addPlugin(TransformsPlugin).addPlugin(WebGL2RenderingPlugin)
