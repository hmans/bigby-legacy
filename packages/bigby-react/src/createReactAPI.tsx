import { App } from "@bigby/core"
import { Entity } from "@bigby/ecs"
import {
  createContext,
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useState
} from "react"

export const createReactAPI = (app: App) => {
  const EntityContext = createContext<Entity>(null!)

  const Entity = forwardRef<Entity, { children?: ReactNode }>(
    ({ children }, ref) => {
      const [entity] = useState(() => app.world.add([]))

      useImperativeHandle(ref, () => entity)

      return (
        <EntityContext.Provider value={entity}>
          {children}
        </EntityContext.Provider>
      )
    }
  )

  return { Entity }
}
