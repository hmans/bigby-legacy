import { App, System } from "@bigby/core"

export class Input {
  move = {
    x: 0,
    y: 0
  }

  aim = {
    x: 0,
    y: 0
  }
}

export class InputSystem extends System {
  protected keys = new Set<string>()
  protected entities = this.app.query([Input])

  isPressed = (key: string) => (this.keys.has(key) ? 1 : 0)

  onStart() {
    document.addEventListener("keydown", (e) => {
      this.keys.add(e.code)
    })

    document.addEventListener("keyup", (e) => {
      this.keys.delete(e.code)
    })
  }

  onEarlyUpdate() {
    for (const [_, input] of this.entities) {
      input.move.x = this.isPressed("KeyD") - this.isPressed("KeyA")
      input.move.y = this.isPressed("KeyW") - this.isPressed("KeyS")

      input.aim.x = this.isPressed("ArrowRight") - this.isPressed("ArrowLeft")
      input.aim.y = this.isPressed("ArrowUp") - this.isPressed("ArrowDown")
    }
  }
}

export function InputPlugin(app: App) {
  app.registerComponent(Input)

  app.spawn([new InputSystem(app)])

  return app
}
