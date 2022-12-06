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

  it("provides setters for its components", () => {
    const v = new Vector3()
    v.x = 1
    v.y = 2
    v.z = 3
    expect(v.x).toBe(1)
    expect(v.y).toBe(2)
    expect(v.z).toBe(3)
  })
})

describe(Vector3.add, () => {
  it("adds two vectors, mutating the first vector", () => {
    const v1 = new Vector3(1, 2, 3)
    const v2 = new Vector3(4, 5, 6)
    Vector3.add(v1, v2)
    expect(v1.x).toBe(5)
    expect(v1.y).toBe(7)
    expect(v1.z).toBe(9)
  })

  it("returns the first vector", () => {
    const v1 = new Vector3(1, 2, 3)
    const v2 = new Vector3(4, 5, 6)
    const result = Vector3.add(v1, v2)
    expect(result).toBe(v1)
  })
})

describe(Vector3.addScalar, () => {
  it("adds a scalar to a vector, mutating the vector", () => {
    const v = new Vector3(1, 2, 3)
    Vector3.addScalar(v, 4)
    expect(v.x).toBe(5)
    expect(v.y).toBe(6)
    expect(v.z).toBe(7)
  })

  it("returns the vector", () => {
    const v = new Vector3(1, 2, 3)
    const result = Vector3.addScalar(v, 4)
    expect(result).toBe(v)
  })
})

describe(Vector3.subtract, () => {
  it("subtracts two vectors, mutating the first vector", () => {
    const v1 = new Vector3(1, 2, 3)
    const v2 = new Vector3(4, 5, 6)
    Vector3.subtract(v1, v2)
    expect(v1.x).toBe(-3)
    expect(v1.y).toBe(-3)
    expect(v1.z).toBe(-3)
  })

  it("returns the first vector", () => {
    const v1 = new Vector3(1, 2, 3)
    const v2 = new Vector3(4, 5, 6)
    const result = Vector3.subtract(v1, v2)
    expect(result).toBe(v1)
  })
})

describe(Vector3.subtractScalar, () => {
  it("subtracts a scalar from a vector, mutating the vector", () => {
    const v = new Vector3(1, 2, 3)
    Vector3.subtractScalar(v, 4)
    expect(v.x).toBe(-3)
    expect(v.y).toBe(-2)
    expect(v.z).toBe(-1)
  })

  it("returns the vector", () => {
    const v = new Vector3(1, 2, 3)
    const result = Vector3.subtractScalar(v, 4)
    expect(result).toBe(v)
  })
})

describe(Vector3.copy, () => {
  it("copies the values from one vector to another, mutating the target", () => {
    const v1 = new Vector3(1, 2, 3)
    const v2 = new Vector3(4, 5, 6)
    Vector3.copy(v1, v2)
    expect(v1.x).toBe(4)
    expect(v1.y).toBe(5)
    expect(v1.z).toBe(6)
  })

  it("returns the target vector", () => {
    const v1 = new Vector3(1, 2, 3)
    const v2 = new Vector3(4, 5, 6)
    const result = Vector3.copy(v1, v2)
    expect(result).toBe(v1)
  })
})

describe(Vector3.multiply, () => {
  it("multiplies two vectors, mutating the first vector", () => {
    const v1 = new Vector3(1, 2, 3)
    const v2 = new Vector3(4, 5, 6)
    Vector3.multiply(v1, v2)
    expect(v1.x).toBe(4)
    expect(v1.y).toBe(10)
    expect(v1.z).toBe(18)
  })

  it("returns the first vector", () => {
    const v1 = new Vector3(1, 2, 3)
    const v2 = new Vector3(4, 5, 6)
    const result = Vector3.multiply(v1, v2)
    expect(result).toBe(v1)
  })
})

describe(Vector3.multiplyScalar, () => {
  it("multiplies a vector by a scalar, mutating the vector", () => {
    const v = new Vector3(1, 2, 3)
    Vector3.multiplyScalar(v, 4)
    expect(v.x).toBe(4)
    expect(v.y).toBe(8)
    expect(v.z).toBe(12)
  })

  it("returns the vector", () => {
    const v = new Vector3(1, 2, 3)
    const result = Vector3.multiplyScalar(v, 4)
    expect(result).toBe(v)
  })
})

describe(Vector3.divide, () => {
  it("divides two vectors, mutating the first vector", () => {
    const v1 = new Vector3(1, 2, 3)
    const v2 = new Vector3(4, 5, 6)
    Vector3.divide(v1, v2)
    expect(v1.x).toBe(0.25)
    expect(v1.y).toBe(0.4)
    expect(v1.z).toBe(0.5)
  })

  it("returns the first vector", () => {
    const v1 = new Vector3(1, 2, 3)
    const v2 = new Vector3(4, 5, 6)
    const result = Vector3.divide(v1, v2)
    expect(result).toBe(v1)
  })
})

describe(Vector3.divideScalar, () => {
  it("divides a vector by a scalar, mutating the vector", () => {
    const v = new Vector3(1, 2, 3)
    Vector3.divideScalar(v, 4)
    expect(v.x).toBe(0.25)
    expect(v.y).toBe(0.5)
    expect(v.z).toBe(0.75)
  })

  it("returns the vector", () => {
    const v = new Vector3(1, 2, 3)
    const result = Vector3.divideScalar(v, 4)
    expect(result).toBe(v)
  })
})

describe(Vector3.dot, () => {
  it("returns the dot product of two vectors", () => {
    const v1 = new Vector3(1, 2, 3)
    const v2 = new Vector3(4, 5, 6)
    const result = Vector3.dot(v1, v2)
    expect(result).toBe(32)
  })
})

describe(Vector3.cross, () => {
  it("returns the cross product of two vectors", () => {
    const v = new Vector3()
    const a = new Vector3(1, 2, 3)
    const b = new Vector3(4, 5, 6)
    const result = Vector3.cross(v, a, b)
    expect(result).toBe(v)
    expect(v.x).toBe(-3)
    expect(v.y).toBe(6)
    expect(v.z).toBe(-3)
  })
})

describe(Vector3.magnitude, () => {
  it("returns the magnitude of a vector", () => {
    const v = new Vector3(1, 2, 3)
    const result = Vector3.magnitude(v)
    expect(result).toBe(Math.sqrt(14))
  })
})

describe(Vector3.magnitudeSquared, () => {
  it("returns the squared magnitude of a vector", () => {
    const v = new Vector3(1, 2, 3)
    const result = Vector3.magnitudeSquared(v)
    expect(result).toBe(14)
  })
})

describe(Vector3.lerp, () => {
  it("returns the linear interpolation between two vectors", () => {
    const a = new Vector3(1, 2, 3)
    const b = new Vector3(4, 5, 6)
    const v = new Vector3()
    const result = Vector3.lerp(v, a, b, 0.5)
    expect(v.x).toBe(2.5)
    expect(v.y).toBe(3.5)
    expect(v.z).toBe(4.5)
  })

  it("returns the target vector", () => {
    const a = new Vector3(1, 2, 3)
    const b = new Vector3(4, 5, 6)
    const v = new Vector3()
    const result = Vector3.lerp(v, a, b, 0.5)
    expect(result).toBe(v)
  })
})

describe(Vector3.normalize, () => {
  it("normalizes a vector, mutating the vector", () => {
    const v = new Vector3(1, 2, 3)
    Vector3.normalize(v, v)
    expect(v.x).toBe(1 / Math.sqrt(14))
    expect(v.y).toBe(2 / Math.sqrt(14))
    expect(v.z).toBe(3 / Math.sqrt(14))
  })

  it("returns the vector", () => {
    const v = new Vector3(1, 2, 3)
    const result = Vector3.normalize(v, v)
    expect(result).toBe(v)
  })
})
