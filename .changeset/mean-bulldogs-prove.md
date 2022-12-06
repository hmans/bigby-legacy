---
"@maxiplex/core": patch
---

`.use(plugin)` now no-ops when `plugin` has been registered previously, making it safe to load the same plugin multiple times.
