import { App } from "@bigby/core"

export class Input {
  x = 0
  y = 0
}

export interface IInput {
  input?: Input
}

export function InputPlugin(app: App) {
  const keys = new Set<string>()
  const entities = app.world.with("input")

  const isPressed = (key: string) => (keys.has(key) ? 1 : 0)

  app.addStartupSystem(() => {
    document.addEventListener("keydown", (e) => {
      keys.add(e.key)
    })

    document.addEventListener("keyup", (e) => {
      keys.delete(e.key)
    })
  })

  app.addSystem((dt) => {
    for (const { input } of entities) {
      input.x = isPressed("d") - isPressed("a")
      input.y = isPressed("w") - isPressed("s")
    }
  })

  return app
}
