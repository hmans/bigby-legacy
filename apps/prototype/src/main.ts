import { App, TickerPlugin } from "bigby"
import "./style.css"

/* Plugin */

abstract class System {
  abstract tick(dt: number): void
}

abstract class Update {}

class EarlyUpdate extends Update {}
class NormalUpdate extends Update {}
class LateUpdate extends Update {}
class RenderUpdate extends Update {}

const Systems = (stages: typeof Update[]) => (app: App) => {
  app.registerComponent(System)
  app.registerComponent(Update)

  const queries = stages.map((stage) => app.query([System, stage]))

  const tick = (dt: number) => {
    for (const query of queries) {
      for (const [_, system] of query) {
        system.tick(dt)
      }
    }
  }

  app.onTick(tick)
}

/* App */

const app = new App()
app.use(TickerPlugin)
app.use(Systems([EarlyUpdate, NormalUpdate, LateUpdate, RenderUpdate]))
app.start()

class HelloSystem extends System {
  tick(dt: number) {
    console.log("hello!")
  }
}

app.spawn([new HelloSystem(), new EarlyUpdate()])
