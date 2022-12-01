import { ThreePlugin } from "@bigby/plugin-three"
import { App, TickerPlugin, TransformsPlugin } from "bigby"
import "./style.css"

new App()
  .addPlugin(TickerPlugin)
  .addPlugin(TransformsPlugin)
  .addPlugin(ThreePlugin)
  .run()
