import { App } from "./App"

describe(App, () => {
  describe("use", () => {
    it("executes the given function, passing itself to it", () => {
      const app = new App()
      const fn = jest.fn()
      app.use(fn)
      expect(fn).toHaveBeenCalledWith(app)
    })

    it("returns itself", () => {
      const app = new App()
      const fn = jest.fn()
      const result = app.use(fn)
      expect(result).toBe(app)
    })

    describe("if the plugin was already used previously", () => {
      it("does not execute the given function", () => {
        const app = new App()
        const fn = jest.fn()
        app.use(fn)
        app.use(fn)
        expect(fn).toHaveBeenCalledTimes(1)
      })
    })
  })
})
