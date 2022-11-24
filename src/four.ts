import { mat4, quat, vec3, mat3 } from "gl-matrix"

export class Object3D {
  readonly matrix = mat4.create()
  readonly quaternion = quat.create()
  readonly position = vec3.create()
  readonly scale = vec3.set(vec3.create(), 1, 1, 1)
  readonly up = vec3.set(vec3.create(), 0, 1, 0)
  readonly children: Object3D[] = []
  public parent: Object3D | null = null
  public matrixAutoUpdate = true
  public visible = true

  lookAt(target: vec3): void {
    mat4.lookAt(this.matrix, this.position, target, this.up)
    mat4.getRotation(this.quaternion, this.matrix)
  }

  updateMatrix(): void {
    if (this.matrixAutoUpdate)
      mat4.fromRotationTranslationScale(
        this.matrix,
        this.quaternion,
        this.position,
        this.scale
      )
    if (this.parent) mat4.multiply(this.matrix, this.matrix, this.parent.matrix)
    for (const child of this.children) child.updateMatrix()
  }

  add(...children: Object3D[]): void {
    for (const child of children) {
      this.children.push(child)
      child.parent = this
    }
  }

  remove(...children: Object3D[]): void {
    for (const child of children) {
      const childIndex = this.children.indexOf(child)
      if (childIndex !== -1) this.children.splice(childIndex, 1)
      child.parent = null
    }
  }

  traverse(callback: (object: Object3D) => boolean | void): void {
    if (callback(this)) return
    for (const child of this.children) child.traverse(callback)
  }
}

export class Camera extends Object3D {
  public fov: number
  public aspect: number
  public near: number
  public far: number
  readonly projectionMatrix = mat4.create()
  readonly viewMatrix = mat4.create()

  constructor(fov = 45, aspect = 1, near = 0.1, far = 1000) {
    super()

    this.fov = fov
    this.aspect = aspect
    this.near = near
    this.far = far
  }

  updateMatrix(): void {
    super.updateMatrix()
    if (this.matrixAutoUpdate)
      mat4.perspectiveNO(
        this.projectionMatrix,
        this.fov * (Math.PI / 180),
        this.aspect,
        this.near,
        this.far
      )
    mat4.copy(this.viewMatrix, this.matrix)
    mat4.invert(this.viewMatrix, this.viewMatrix)
  }
}

export class Texture {
  public image?: TexImageSource
  public needsUpdate = true

  constructor(image?: TexImageSource) {
    this.image = image
  }
}

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

export class Geometry {
  readonly attributes: Record<string, Attribute> = {}

  constructor(attributes: Record<string, Attribute>) {
    for (const key in attributes) {
      this.attributes[key] = attributes[key]
      this.attributes[key].needsUpdate = true
    }
  }
}

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

export type Mode = "TRIANGLES" | "POINTS" | "LINES"

export class Mesh extends Object3D {
  readonly geometry: Geometry
  readonly material: Material
  readonly modelViewMatrix = mat4.create()
  readonly normalMatrix = mat3.create()
  public mode: Mode = "TRIANGLES"
  public instances = 1

  constructor(geometry: Geometry, material: Material) {
    super()
    this.geometry = geometry
    this.material = material
  }
}

const lineNumbers = (source: string, offset = 0): string =>
  source.replace(/^/gm, () => `${offset++}:`)

export interface Compiled {
  program: WebGLProgram
  VAO: WebGLVertexArrayObject
}

export class Renderer {
  readonly canvas: HTMLCanvasElement
  readonly gl: WebGL2RenderingContext
  public autoClear = true
  private _renderTarget: RenderTarget | null = null
  private _compiled = new WeakMap<Mesh, Compiled>()
  private _buffers = new WeakMap<Attribute, WebGLBuffer>()
  private _textures = new WeakMap<Texture, WebGLTexture>()
  private _FBOs = new WeakMap<RenderTarget, WebGLFramebuffer>()
  private _textureIndex = 0
  private _a = vec3.create()
  private _b = vec3.create()
  private _c = vec3.create()

  constructor(canvas: HTMLCanvasElement = document.createElement("canvas")) {
    this.canvas = canvas
    this.gl = canvas.getContext("webgl2", {
      antialias: true,
      powerPreference: "high-performance"
    })!
  }

  setSize(width: number, height: number): void {
    this.canvas.width = width
    this.canvas.height = height
  }

  setUniform(program: WebGLProgram, name: string, value: Uniform): void {
    const location = this.gl.getUniformLocation(program, name)
    if (location === -1) return

    if (value instanceof Texture) {
      let texture = this._textures.get(value)!
      if (!texture) {
        texture = this.gl.createTexture()!
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
        this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, 1)
        this.gl.generateMipmap(this.gl.TEXTURE_2D)
        this._textures.set(value, texture)
      }

      const index = this._textureIndex++
      this.gl.activeTexture(this.gl.TEXTURE0 + index)
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
      if (value.needsUpdate) {
        this.gl.texImage2D(
          this.gl.TEXTURE_2D,
          0,
          this.gl.RGBA,
          this.gl.RGBA,
          this.gl.UNSIGNED_BYTE,
          value.image!
        )
        value.needsUpdate = false
      }
      return this.gl.uniform1i(location, index)
    }

    if (typeof value === "number") return this.gl.uniform1f(location, value)
    switch (value.length) {
      case 2:
        return this.gl.uniform2fv(location, value)
      case 3:
        return this.gl.uniform3fv(location, value)
      case 4:
        return this.gl.uniform4fv(location, value)
      case 9:
        return this.gl.uniformMatrix3fv(location, false, value)
      case 16:
        return this.gl.uniformMatrix4fv(location, false, value)
    }
  }

  compile(mesh: Mesh, camera?: Camera): Compiled {
    mesh.material.uniforms.modelMatrix = mesh.matrix

    if (camera) {
      mesh.material.uniforms.projectionMatrix = camera.projectionMatrix
      mesh.material.uniforms.viewMatrix = camera.viewMatrix
      mesh.material.uniforms.normalMatrix = mesh.normalMatrix
      mesh.material.uniforms.modelViewMatrix = mesh.modelViewMatrix

      mat4.copy(mesh.modelViewMatrix, camera.viewMatrix)
      mat4.multiply(mesh.modelViewMatrix, mesh.modelViewMatrix, mesh.matrix)

      mat4.copy(mesh.modelViewMatrix, camera.viewMatrix)
      mat4.multiply(mesh.modelViewMatrix, mesh.modelViewMatrix, mesh.matrix)
      mat3.normalFromMat4(mesh.normalMatrix, mesh.modelViewMatrix)
    }

    let compiled = this._compiled.get(mesh)
    if (!compiled) {
      const program = this.gl.createProgram()!
      const VAO = this.gl.createVertexArray()!

      const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER)!
      this.gl.shaderSource(vertexShader, mesh.material.vertex)
      this.gl.compileShader(vertexShader)
      this.gl.attachShader(program, vertexShader)

      const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)!
      this.gl.shaderSource(fragmentShader, mesh.material.fragment)
      this.gl.compileShader(fragmentShader)
      this.gl.attachShader(program, fragmentShader)

      this.gl.linkProgram(program)

      for (const shader of [vertexShader, fragmentShader]) {
        const error = this.gl.getShaderInfoLog(shader)
        if (error)
          throw `Error compiling shader: ${error}\n${lineNumbers(
            this.gl.getShaderSource(shader)!
          )}`
      }

      const error = this.gl.getProgramInfoLog(program)
      if (error)
        throw `Error compiling program: ${this.gl.getProgramInfoLog(program)}`

      this.gl.deleteShader(vertexShader)
      this.gl.deleteShader(fragmentShader)

      compiled = { program, VAO }
      this._compiled.set(mesh, compiled)
    }

    this.gl.bindVertexArray(compiled.VAO)
    this.gl.useProgram(compiled.program)

    for (const key in mesh.geometry.attributes) {
      const attribute = mesh.geometry.attributes[key]
      const type =
        key === "index" ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER

      let buffer = this._buffers.get(attribute)
      if (!buffer) {
        buffer = this.gl.createBuffer()!
        this._buffers.set(attribute, buffer)
        this.gl.bindBuffer(type, buffer)
        this.gl.bufferData(type, attribute.data, this.gl.STATIC_DRAW)

        const location = this.gl.getAttribLocation(compiled.program, key)
        if (location !== -1) {
          const slots = Math.min(4, Math.max(1, Math.floor(attribute.size / 3)))

          for (let i = 0; i < slots; i++) {
            this.gl.enableVertexAttribArray(location + i)
            this.gl.vertexAttribPointer(
              location + i,
              attribute.size / slots,
              this.gl.FLOAT,
              false,
              attribute.data.BYTES_PER_ELEMENT * attribute.size,
              attribute.size * i
            )
            if (attribute.divisor)
              this.gl.vertexAttribDivisor(location + i, attribute.divisor)
          }
        }

        attribute.needsUpdate = false
      }

      if (attribute.needsUpdate) {
        this.gl.bufferData(type, attribute.data, this.gl.DYNAMIC_DRAW)
        attribute.needsUpdate = false
      }
    }

    this._textureIndex = 0
    for (const key in mesh.material.uniforms)
      this.setUniform(compiled.program, key, mesh.material.uniforms[key])

    return compiled
  }

  setRenderTarget(target: RenderTarget | null) {
    this._renderTarget = target
  }

  clear(bits = this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT) {
    this.gl.clear(bits)
  }

  sort(scene: Object3D, camera?: Camera): Mesh[] {
    const renderList: Mesh[] = []

    scene.traverse((node) => {
      if (!node.visible) return true
      if (node instanceof Mesh) renderList.push(node)
    })

    if (camera) mat4.getTranslation(this._c, camera.matrix)

    return renderList.sort(
      (a, b) =>
        (b.material.depthTest as unknown as number) -
          (a.material.depthTest as unknown as number) ||
        (!!camera &&
          vec3.distance(mat4.getTranslation(this._b, b.matrix), this._c) -
            vec3.distance(mat4.getTranslation(this._a, a.matrix), this._c)) ||
        (a.material.transparent as unknown as number) -
          (b.material.transparent as unknown as number)
    )
  }

  render(scene: Object3D, camera?: Camera): void {
    if (this._renderTarget) {
      let FBO = this._FBOs.get(this._renderTarget)
      if (!FBO || this._renderTarget.needsUpdate) {
        if (FBO) this.gl.deleteFramebuffer(FBO)
        FBO = this.gl.createFramebuffer()!
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, FBO)

        const attachments: number[] = []

        let attachment = this.gl.COLOR_ATTACHMENT0
        for (const texture of this._renderTarget.textures) {
          attachments.push(attachment)

          let target = this._textures.get(texture)
          if (!target) {
            target = this.gl.createTexture()!
            this.gl.bindTexture(this.gl.TEXTURE_2D, target)
            this.gl.texParameteri(
              this.gl.TEXTURE_2D,
              this.gl.TEXTURE_MIN_FILTER,
              this.gl.NEAREST
            )
            this._textures.set(texture, target)
            texture.needsUpdate = false
          }
          this.gl.bindTexture(this.gl.TEXTURE_2D, target)
          this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            this._renderTarget.width,
            this._renderTarget.height,
            0,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            null
          )

          this.gl.framebufferTexture2D(
            this.gl.DRAW_FRAMEBUFFER,
            attachment,
            this.gl.TEXTURE_2D,
            target,
            0
          )
          attachment++
        }
        this.gl.drawBuffers(attachments)
        this._renderTarget.needsUpdate = false

        this._FBOs.set(this._renderTarget, FBO)
      }

      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, FBO)
      this.gl.viewport(
        0,
        0,
        this._renderTarget.width,
        this._renderTarget.height
      )
    } else {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    }

    if (this.autoClear) this.clear()

    camera?.updateMatrix()
    scene.updateMatrix()

    const renderList = this.sort(scene, camera)
    for (const node of renderList) {
      this.compile(node, camera)

      if (node.material.side === "both") {
        this.gl.disable(this.gl.CULL_FACE)
        this.gl.disable(this.gl.DEPTH_TEST)
      } else {
        this.gl.enable(this.gl.CULL_FACE)
        this.gl.cullFace(
          node.material.side === "front" ? this.gl.BACK : this.gl.FRONT
        )
      }

      if (node.material.depthTest) {
        this.gl.enable(this.gl.DEPTH_TEST)
        this.gl.depthFunc(this.gl.LESS)
      } else {
        this.gl.disable(this.gl.DEPTH_TEST)
      }

      this.gl.depthMask(node.material.depthWrite)

      if (node.material.transparent) {
        this.gl.enable(this.gl.BLEND)
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
      } else {
        this.gl.disable(this.gl.BLEND)
      }

      const mode = this.gl[node.mode]
      const { index, position } = node.geometry.attributes
      if (index)
        this.gl.drawElementsInstanced(
          mode,
          index.data.length / index.size,
          this.gl.UNSIGNED_INT,
          0,
          node.instances
        )
      else
        this.gl.drawArraysInstanced(
          mode,
          0,
          position.data.length / position.size,
          node.instances
        )
    }
  }
}
