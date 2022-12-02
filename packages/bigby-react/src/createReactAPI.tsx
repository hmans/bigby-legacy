import { App } from "@bigby/core"
import { Entity } from "@bigby/ecs"
import { forwardRef, ReactNode, useImperativeHandle, useState } from "react"

export const createReactAPI = (app: App) => {
  const Entity = forwardRef<Entity, { children?: ReactNode }>(
    ({ children }, ref) => {
      const [entity] = useState(() => app.world.add([]))

      useImperativeHandle(ref, () => entity)

      return <>{children}</>
    }
  )

  return { Entity }
}
