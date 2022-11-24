import { Texture } from "./Texture"

export class RenderTarget {
  public width: number
  public height: number
  readonly count: number
  readonly textures: Texture[]
  public needsUpdate = true

  constructor(width: number, height: number, count = 1) {
    this.width = width
    this.height = height
    this.count = count
    this.textures = Array.from({ length: count }, () => new Texture())
  }

  setSize(width: number, height: number): void {
    this.width = width
    this.height = height
    this.needsUpdate = true
  }
}

export interface Attribute {
  data: Float32Array | Uint32Array
  size: number
  divisor?: number
  needsUpdate?: boolean
}
