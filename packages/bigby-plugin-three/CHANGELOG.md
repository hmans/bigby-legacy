# @bigby/plugin-three

## 0.11.0

### Minor Changes

- 49de4db: Moving everything a little closer to Three.js, in order to vastly improve the approachability of this library.
- 3c97ed3: Introduced linear algebra primitives to `@bigby/math` and used them to make `Transform3D` compatible with third-party libraries like Three.js.
- 456e101: `App` now extends `World`, so there is no longer an `app.world`.
- 0d10581: `Transform` was renamed to `Transform3D`.

### Patch Changes

- fce4c4e: `loadGLTF`
- 510a686: Support custom parenting
- 881d8b1: Canvas now automatically resizes on window size change.
- fce4c4e: Fixed color space (sRGB)
- 92febb0: New plugin: `@bigby/plugin-three`. Build Three.js games with Bigby!
- Updated dependencies [1a49332]
- Updated dependencies [d743a6c]
- Updated dependencies [49de4db]
- Updated dependencies [65761ef]
- Updated dependencies [967a650]
- Updated dependencies [3c97ed3]
- Updated dependencies [456e101]
- Updated dependencies [0d10581]
- Updated dependencies [c9f264d]
- Updated dependencies [d743a6c]
  - @bigby/core@0.11.0
  - @bigby/math@0.11.0
