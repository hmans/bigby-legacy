import { App, Matrix4, Quaternion, Transform3D, Vector3 } from "bigby"

export class FollowCamera {}
export class CameraTarget {}

export function FollowCameraPlugin(app: App) {
  app.registerComponent(CameraTarget)
  app.registerComponent(FollowCamera)

  const cameraQuery = app.query([Transform3D, FollowCamera])
  const targetQuery = app.query([Transform3D, CameraTarget])

  const mat4 = new Matrix4()

  app.onLateUpdate((dt) => {
    const camera = cameraQuery.first
    const target = targetQuery.first

    if (camera && target) {
      const targetTransform = target.get(Transform3D)!
      const cameraTransform = camera.get(Transform3D)!

      Matrix4.lookAt(
        mat4,
        cameraTransform.position,
        targetTransform.position,
        new Vector3(0, 1, 0)
      )

      /* Set quaternion from rotation matrix */
      Quaternion.setFromRotationMatrix(cameraTransform.quaternion, mat4)
    }
  })

  return app
}
