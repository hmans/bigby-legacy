import { mat4, quat, vec3 } from "gl-matrix"
import { App } from "./App"

export interface ITransform {
  transform: Transform
}

export class Transform {
  autoUpdate = true

  readonly matrix = mat4.create()

  constructor(
    public readonly position = vec3.create(),
    public readonly quaternion = quat.create(),
    public readonly scale = vec3.set(vec3.create(), 1, 1, 1)
  ) {}
}

export function TransformsSystem(app: App<Partial<ITransform>>) {
  const entities = app.world.with("transform")

  return () => {
    for (const { transform } of entities) {
      if (!transform.autoUpdate) continue

      mat4.fromRotationTranslationScale(
        transform.matrix,
        transform.quaternion,
        transform.position,
        transform.scale
      )
    }
  }
}

export const TransformsPlugin = (app: App<Partial<ITransform>>) =>
  app.addSystem(TransformsSystem(app))
