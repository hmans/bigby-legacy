import { App } from "@bigby/core"

export class Input {
  x = 0
  y = 0
}

export function InputPlugin(app: App) {
  const keys = new Set<string>()
  const entities = app.world.query([Input])

  const isPressed = (key: string) => (keys.has(key) ? 1 : 0)

  app.addStartupSystem(() => {
    document.addEventListener("keydown", (e) => {
      keys.add(e.key)
    })

    document.addEventListener("keyup", (e) => {
      keys.delete(e.key)
    })
  })

  app.addSystem(() => {
    entities.iterate((_, [input]) => {
      input.x = isPressed("d") - isPressed("a")
      input.y = isPressed("w") - isPressed("s")
    })
  })

  return app
}
