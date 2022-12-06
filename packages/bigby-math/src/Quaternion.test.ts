import { Quaternion } from "./Quaternion"

describe(Quaternion, () => {
  it("can be constructed", () => {
    const q = new Quaternion()
    expect(q.x).toBe(0)
    expect(q.y).toBe(0)
    expect(q.z).toBe(0)
    expect(q.w).toBe(1)
  })
})

describe(Quaternion.set, () => {
  it("can set values", () => {
    const q = new Quaternion()
    Quaternion.set(q, 1, 2, 3, 4)
    expect(q.x).toBe(1)
    expect(q.y).toBe(2)
    expect(q.z).toBe(3)
    expect(q.w).toBe(4)
  })
})

describe(Quaternion.rotateX, () => {
  it("rotates the quaternion around the X axis", () => {
    const q = new Quaternion()
    const out = new Quaternion()
    Quaternion.rotateX(out, q, Math.PI)

    expect(out.x).toBe(1)
    expect(out.y).toBe(0)
    expect(out.z).toBe(0)
    expect(out.w).toBe(6.123233995736766e-17)
  })
})
