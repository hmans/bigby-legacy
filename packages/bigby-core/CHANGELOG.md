# @bigby/core

## 0.11.0

### Minor Changes

- 1a49332: New ECS! Oh no!
- d743a6c: Additional update stages `onEarlyUpdate`, `onLateUpdate` and `onRender`.
- 49de4db: Moving everything a little closer to Three.js, in order to vastly improve the approachability of this library.
- 65761ef: `addPlugin` is now `use`.
- 967a650: `Event` -> `EventDispatcher`
- 3c97ed3: Introduced linear algebra primitives to `@bigby/math` and used them to make `Transform3D` compatible with third-party libraries like Three.js.
- 456e101: `App` now extends `World`, so there is no longer an `app.world`.
- 0d10581: `Transform` was renamed to `Transform3D`.
- c9f264d: `addStartupSystem` is now `onStart`, `addInitializer` is now `onLoad`, and `addSystem` is now `onUpdate`.
- d743a6c: Now using `@maxiplex/event-dispatcher` instead of `@hmans/event`.

### Patch Changes

- Updated dependencies [dbfb8e0]
- Updated dependencies [1a49332]
- Updated dependencies [cc07f8d]
- Updated dependencies [12a6989]
- Updated dependencies [419727a]
- Updated dependencies [c9f264d]
- Updated dependencies [49de4db]
- Updated dependencies [a6b3570]
- Updated dependencies [967a650]
- Updated dependencies [94a0e8d]
- Updated dependencies [51f0619]
- Updated dependencies [3c97ed3]
- Updated dependencies [456e101]
- Updated dependencies [d743a6c]
  - @maxiplex/core@0.11.0
  - @bigby/math@0.11.0
  - @maxiplex/event-dispatcher@0.11.0

## 0.10.1

### Patch Changes

- Force version bump.
- Updated dependencies
  - @bigby/math@0.10.1

## 0.9.0

### Minor Changes

- 1529fe6: Let's go!

### Patch Changes

- Updated dependencies [1529fe6]
  - @bigby/math@0.9.0

## 0.8.2

### Patch Changes

- 6abcde4: Initializers!

## 0.8.1

### Patch Changes

- 3be2de3: Extracted things into individual packages.
- Updated dependencies [3be2de3]
  - @bigby/math@0.8.1
