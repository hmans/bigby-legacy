import { AnimationFrameTicker, App, EarlyUpdate, System } from "bigby"
import "./style.css"

const app = new App()
app.use(AnimationFrameTicker())
app.start()

class HelloSystem extends System {
  tick(dt: number) {
    console.log("hello!")
  }
}

app.spawn([HelloSystem, EarlyUpdate])
