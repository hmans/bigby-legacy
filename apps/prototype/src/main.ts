import { App, EarlyUpdate, System, TickerPlugin } from "bigby"
import "./style.css"

const app = new App()
app.use(TickerPlugin())
app.start()

class HelloSystem extends System {
  tick(dt: number) {
    console.log("hello!")
  }
}

app.spawn([new HelloSystem(), new EarlyUpdate()])
