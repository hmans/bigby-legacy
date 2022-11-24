import { Texture } from "./Texture"

export type Uniform = number | number[] | Float32Array | Texture

export type Side = "front" | "back" | "both"

export interface MaterialOptions {
  uniforms?: Record<string, Uniform>
  vertex: string
  fragment: string
  side?: Side
  transparent?: boolean
  depthTest?: boolean
  depthWrite?: boolean
}

export class Material implements MaterialOptions {
  readonly uniforms: Record<string, Uniform> = {}
  readonly vertex!: string
  readonly fragment!: string
  public side: Side = "front"
  public transparent = false
  public depthTest = true
  public depthWrite = true

  constructor(options: MaterialOptions) {
    Object.assign(this, options)
  }
}
