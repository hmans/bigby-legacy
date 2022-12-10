import { EventDispatcher } from "../src"

describe("EventDispatcher", () => {
  it("creates a new event", () => {
    const event = new EventDispatcher()
    expect(event).toBeDefined()
  })

  describe("add", () => {
    it("adds a listener to the event", () => {
      const event = new EventDispatcher()
      const listener = jest.fn()
      event.addListener(listener)
      expect(event.listeners.size).toBe(1)
    })

    it("returns a function that will remove the listener again", () => {
      const event = new EventDispatcher()
      const listener = jest.fn()
      const remove = event.addListener(listener)
      expect(event.listeners.size).toBe(1)
      remove()
      expect(event.listeners.size).toBe(0)
    })
  })

  describe("remove", () => {
    it("removes a listener from the event", () => {
      const event = new EventDispatcher()
      const listener = jest.fn()
      event.addListener(listener)
      expect(event.listeners.size).toBe(1)
      event.removeListener(listener)
      expect(event.listeners.size).toBe(0)
    })
  })

  describe("emit", () => {
    it("emits an event", () => {
      const event = new EventDispatcher<string>()
      const listener = jest.fn()
      event.addListener(listener)
      event.emit("test")
      expect(listener).toHaveBeenCalledWith("test")
    })
  })

  describe("clear", () => {
    it("clears all listeners from the event", () => {
      const event = new EventDispatcher()
      const listener = jest.fn()
      event.addListener(listener)
      expect(event.listeners.size).toBe(1)
      event.clearListeners()
      expect(event.listeners.size).toBe(0)
    })
  })
})
