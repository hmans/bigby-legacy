import { mat4, quat, vec3 } from "gl-matrix"

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
