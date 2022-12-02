import { App } from "@bigby/core"
import { Component, Constructor, Entity } from "@bigby/ecs"
import React, {
  createContext,
  forwardRef,
  ReactElement,
  ReactNode,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState
} from "react"
import mergeRefs from "react-merge-refs"

export const createReactAPI = (app: App) => {
  const EntityContext = createContext<Entity>(null!)

  const useCurrentEntity = () => {
    const entity = useContext(EntityContext)
    if (!entity) throw new Error("No current entity")
    return entity
  }

  const makeComponent = <C extends Component>(ctor: Constructor<C>) =>
    forwardRef<C, Partial<C>>((props, ref) => {
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

  const Component = forwardRef<any, { children?: ReactNode }>(
    ({ children }, parentRef) => {
      const entity = useContext(EntityContext)
      const ref = useRef<any>(null!)

      if (!entity) {
        throw new Error("<Component> must be a child of <Entity>")
      }

      /* Handle creation and removal of component with a value prop */
      useLayoutEffect(() => {
        const component = ref.current
        if (!component) return

        console.log("Adding component", component)
        app.world.addComponent(entity, component)
        return () => {
          app.world.removeComponent(entity, component)
        }
      }, [entity])

      /* Handle setting of child value */
      if (children) {
        const child = React.Children.only(children) as ReactElement

        return React.cloneElement(child, {
          ref: mergeRefs([(child as any).ref, ref])
        })
      }

      return null
    }
  )

  return { Entity, Component, useCurrentEntity, makeComponent }
}
