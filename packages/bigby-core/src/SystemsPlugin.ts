import { App } from "./App"
import { System } from "./System"

export function SystemsPlugin(app: App) {
  app.registerComponent(System)
  const systems = app.query([System])

  /* Invoke all systems' onStart methods */
  // app.onStart(() => {
  //   for (const [_, system] of systems) system.onStart?.()
  // })

  /* Start systems once they show up */
  /* TODO: if the app is already started! */
  systems.onEntityAdded.add((entity) => {
    const system = entity.get(System)!
    system.onStart?.()
  })

  /* Invoke all systems' onStop methods */
  app.onStop(() => {
    for (const [_, system] of systems) system.onStop?.()
  })

  app.onEarlyUpdateCallbacks.add((dt) => {
    for (const [_, system] of systems) system.onEarlyUpdate?.(dt)
  })

  app.onFixedUpdateCallbacks.add((dt) => {
    for (const [_, system] of systems) system.onFixedUpdate?.(dt)
  })

  app.onUpdateCallbacks.add((dt) => {
    for (const [_, system] of systems) system.onUpdate?.(dt)
  })

  app.onLateUpdateCallbacks.add((dt) => {
    for (const [_, system] of systems) system.onLateUpdate?.(dt)
  })

  app.onRenderCallbacks.add((dt) => {
    for (const [_, system] of systems) system.onRender?.(dt)
  })
}
