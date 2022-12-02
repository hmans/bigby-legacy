import { App } from "@bigby/core"
import { Component, Constructor, Entity } from "@bigby/ecs"
import {
  createContext,
  forwardRef,
  ReactNode,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useState
} from "react"

export const createReactAPI = (app: App) => {
  const EntityContext = createContext<Entity>(null!)

  const useCurrentEntity = () => {
    const entity = useContext(EntityContext)
    if (!entity) throw new Error("No current entity")
    return entity
  }

  const makeComponent = (ctor: Constructor<Component>) => {
    return forwardRef((props: any, ref: any) => {
      /* Fetch the current entity context. */
      const entity = useCurrentEntity()

      /* Create our component instance. */
      const [componentInstance] = useState(() => new ctor())

      /* Add the component to the entity. */
      useLayoutEffect(() => {
        app.world.addComponent(entity, componentInstance)

        return () => {
          app.world.removeComponent(entity, componentInstance)
        }
      }, [])

      /* Expose the component instance to the parent. */
      useImperativeHandle(ref, () => componentInstance)

      return null
    })
  }

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

  return { Entity, useCurrentEntity, makeComponent }
}
