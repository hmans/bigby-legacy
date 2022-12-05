import { App, Matrix4, Transform3D, Vector3 } from "bigby"
import * as THREE from "three"

export class CameraTarget {}

export function FollowCameraPlugin(app: App) {
  app.registerComponent(CameraTarget)

  const cameraQuery = app.query([Transform3D, THREE.Camera])
  const targetQuery = app.query([Transform3D, CameraTarget])

  const mat4 = new Matrix4()

  app.onLateUpdate(() => {
    const camera = cameraQuery.first
    const target = targetQuery.first

    if (camera && target) {
      const targetTransform = target.get(Transform3D)!
      const cameraTransform = camera.get(Transform3D)!
      /* TODO: Rotate quaternion to look at target */

      Matrix4.lookAt(
        mat4,
        cameraTransform.position,
        targetTransform.position,
        new Vector3(0, 1, 0)
      )

      Matrix4.copy(cameraTransform.matrix, mat4)
    }
  })

  return app
}
