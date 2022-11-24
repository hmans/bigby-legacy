export class Texture {
  public image?: TexImageSource
  public needsUpdate = true

  constructor(image?: TexImageSource) {
    this.image = image
  }
}
