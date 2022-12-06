import { Vector3 } from "./Vector3"

describe(Vector3, () => {
  it("should be created", () => {
    const v = new Vector3()
    expect(v.x).toBe(0)
    expect(v.y).toBe(0)
    expect(v.z).toBe(0)
  })

  it("should be created with values", () => {
    const v = new Vector3(1, 2, 3)
    expect(v.x).toBe(1)
    expect(v.y).toBe(2)
    expect(v.z).toBe(3)
  })
})
