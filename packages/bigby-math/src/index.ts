export * from "./Vector2"
export * from "./Vector3"
export * from "./Quaternion"

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
