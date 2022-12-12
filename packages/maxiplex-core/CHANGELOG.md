# @maxiplex/core

## 0.11.0

### Minor Changes

- dbfb8e0: `add` is now `spawn`, `remove` is now `destroy`
- 1a49332: New ECS! Oh no!
- cc07f8d: Before using components, the app now expects them to be registered first. This is done through `app.registerComponent(constructor)`. This is primarily intended to prevent the user from accidentally using the wrong class as a component. Plugins are expected to register their components on initialization.
- 419727a: The signature of `query.iterate` has been changed to now pass a flat list of the entity and its components into the callback:

  ```js
  /* Before: */
  const query = app.query([Position, Velocity])

  query.iterate((entity, [position, velocity]) => {
    // ...
  })

  /* Now: */
  query.iterate((entity, position, velocity) => {
    // ...
  })
  ```

  Queries now also have a custom iterator, allowing you to iterate over them directly:

  ```js
  const query = app.query([Position, Velocity])

  for (const [entity, position, velocity] of query) {
    // ...
  }
  ```

- c9f264d: `world.requireComponent(c)`, throws when the given component is not registered yet. Can be used by plugins to declare their dependencies.
- 49de4db: Moving everything a little closer to Three.js, in order to vastly improve the approachability of this library.
- 967a650: `Event` -> `EventDispatcher`
- 3c97ed3: Introduced linear algebra primitives to `@bigby/math` and used them to make `Transform3D` compatible with third-party libraries like Three.js.
- 456e101: `App` now extends `World`, so there is no longer an `app.world`.
- d743a6c: Now using `@maxiplex/event-dispatcher` instead of `@hmans/event`.

### Patch Changes

- 12a6989: `entity.add(component)` and `entity.remove(component)`
- a6b3570: `.use(plugin)` now no-ops when `plugin` has been registered previously, making it safe to load the same plugin multiple times.
- 94a0e8d: Now exporting `Query` and `Entity`.
- 51f0619: `getSingletonComponent`
- Updated dependencies [967a650]
- Updated dependencies [d743a6c]
  - @maxiplex/event-dispatcher@0.11.0
