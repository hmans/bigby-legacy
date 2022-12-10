import { EventDispatcher } from "@maxiplex/event-dispatcher"
import { Entity } from "./Entity"
import { Query } from "./Query"
import { Component, ComponentQuery, Constructor } from "./types"

export type OnLoadCallback<A extends World> = (app: A) => void | Promise<void>

export type OnStartCallback<A extends World> = (app: A) => void | Promise<void>

export type OnStopCallback<A extends World> = (app: A) => void

export type Plugin<A extends World> = (app: A) => A | void

export type BaseEntity = {}

export class World {
  constructor() {}

  entities = new Array<Entity>()
  protected registeredComponents = new Set<Component>()
  protected registeredPlugins = new Set<Plugin<typeof this>>()

  onEntityAdded = new EventDispatcher<Entity>()
  onEntityRemoved = new EventDispatcher<Entity>()
  onEntityUpdated = new EventDispatcher<Entity>()

  onLoadCallbacks = new Array<OnLoadCallback<typeof this>>()
  onStartCallbacks = new Array<OnStartCallback<typeof this>>()
  onStopCallbacks = new EventDispatcher<typeof this>()

  protected queries = new Map<string, Query<any>>()

  spawn(components: Component[] = []) {
    /* Check all given components if they've been registered with us */
    components.forEach((component) => {
      this.assertRegisteredComponent(component.constructor)
    })

    /* Create a new entity */
    const entity = new Entity(this)
    entity.components.push(...components)

    /* Add the entity to the world */
    this.entities.push(entity)
    this.onEntityAdded.emit(entity)

    return entity
  }

  destroy(entity: Entity) {
    /* Remove entity */
    const index = this.entities.indexOf(entity)
    if (index !== -1) {
      this.entities.splice(index, 1)
      this.onEntityRemoved.emit(entity)
    }

    return entity
  }

  registerComponent(ctor: Constructor<Component>) {
    this.registeredComponents.add(ctor)
    return this
  }

  addComponent(entity: Entity, component: Component) {
    /* Check if the component has been registered with us */
    this.assertRegisteredComponent(component.constructor)

    /* check if the component is already present */
    if (entity.components.some((c) => c.constructor === component.constructor))
      return false

    /* Add the component to the entity */
    entity.components.push(component)

    /* Emit the event */
    this.onEntityUpdated.emit(entity)

    return true
  }

  removeComponent(
    entity: Entity,
    component: Component | Constructor<Component>
  ) {
    /* Remove the component from the entity */
    const index = entity.components.findIndex(
      (c) => c === component || c.constructor === component
    )
    if (index === -1) return false

    /* Remove the component from the entity */
    entity.components.splice(index, 1)

    /* Emit the onEntityUpdated event */
    this.onEntityUpdated.emit(entity)

    return true
  }

  getSingletonComponent<T extends Component>(ctor: Constructor<T>) {
    this.assertRegisteredComponent(ctor)
    /* TODO: optimize this! */
    return this.query([ctor]).first?.get(ctor)
  }

  requireComponent(...query: Constructor<Component>[]) {
    query.forEach((ctor) => this.assertRegisteredComponent(ctor))
    return this
  }

  private assertRegisteredComponent(ctor: Constructor<Component>) {
    /* Check our list of component constructors */
    if (this.registeredComponents.has(ctor)) return

    /* Check if the given component uses a child class */
    for (const registered of this.registeredComponents) {
      if (ctor.prototype instanceof registered) return
    }

    /* Otherwise, throw an error */
    throw new Error(
      `Component "${ctor.name}" unknown. Did you forget to register it first, or add a plugin that does this?`
    )
  }

  query<Q extends readonly Component[]>(query: ComponentQuery<Q>): Query<Q> {
    /* Check if all these components have been registered with us */
    query.forEach((ctor) => this.assertRegisteredComponent(ctor))

    /* Memoize query instances */
    /* TODO: find a better way to build a key */
    const key = query.toString()

    if (!this.queries.has(key)) {
      this.queries.set(key, new Query<Q>(this, query))
    }

    return this.queries.get(key)!
  }

  use(plugin: Plugin<typeof this>) {
    if (this.registeredPlugins.has(plugin)) return this

    /* Register and initialize the plugin */
    this.registeredPlugins.add(plugin)
    const result = plugin(this)

    return result || this
  }

  onLoad(callback: OnLoadCallback<typeof this>) {
    this.onLoadCallbacks.push(callback)
    return this
  }

  onStart(callback: OnStartCallback<typeof this>) {
    this.onStartCallbacks.push(callback)
    return this
  }

  onStop(callback: OnStopCallback<typeof this>) {
    this.onStopCallbacks.add(callback)
    return this
  }

  async start() {
    console.log("✅ Starting App")

    /* Execute and wait for initializers to complete */
    await Promise.all(this.onLoadCallbacks.map((callback) => callback(this)))

    /* Execute and wait for startupSystems to complete */
    await Promise.all(this.onStartCallbacks.map((callback) => callback(this)))

    return this
  }

  stop() {
    console.log("⛔ Stopping App")
    this.onStopCallbacks.emit(this)
    return this
  }
}
