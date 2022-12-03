---
"@bigby/ecs": minor
---

The signature of `query.iterate` has been changed to now pass a flat list of the entity and its components into the callback:

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
