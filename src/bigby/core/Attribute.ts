export interface Attribute {
  data: Float32Array | Uint32Array
  size: number
  divisor?: number
  needsUpdate?: boolean
}
