import { App, Matrix4, Quaternion, Transform3D, Vector3 } from "bigby"

export class FollowCamera {
  delta = 0.01
}

export class CameraTarget {}

export function FollowCameraPlugin(app: App) {
  app.registerComponent(CameraTarget)
  app.registerComponent(FollowCamera)

  const cameraQuery = app.query([Transform3D, FollowCamera])
  const targetQuery = app.query([Transform3D, CameraTarget])

  const _mat4 = new Matrix4()
  const _quat = new Quaternion()

  app.onLateUpdate((dt) => {
    const camera = cameraQuery.first
    const target = targetQuery.first

    if (camera && target) {
      /* Nope, I don't really want to fetch these every frame */
      const targetTransform = target.get(Transform3D)!
      const cameraTransform = camera.get(Transform3D)!
      const follow = camera.get(FollowCamera)!

      /* Make a rotation matrix */
      Matrix4.targetTo(
        _mat4,
        cameraTransform.position,
        targetTransform.position,
        new Vector3(0, 1, 0)
      )

      /* Extract the rotation from the matrix */
      Quaternion.setFromRotationMatrix(_quat, _mat4)

      /* Apply the rotation to the camera, but interpolate */
      Quaternion.slerp(
        cameraTransform.quaternion,
        cameraTransform.quaternion,
        _quat,
        follow.delta
      )
    }
  })

  return app
}
