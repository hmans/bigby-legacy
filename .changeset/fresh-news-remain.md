---
"@bigby/ecs": minor
---

Before using components, the app now expects them to be registered first. This is done through `app.registerComponent(constructor)`. This is primarily intended to prevent the user from accidentally using the wrong class as a component. Plugins are expected to register their components on initialization.
