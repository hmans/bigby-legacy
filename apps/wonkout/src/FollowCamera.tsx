import { App, LateUpdate, System } from "bigby"
import { Matrix4, Object3D, Quaternion } from "three"

export class FollowCamera {
  delta = 0.01
}

export class CameraTarget {}

export function FollowCameraPlugin(app: App) {
  app.registerComponent(CameraTarget)
  app.registerComponent(FollowCamera)

  const cameraQuery = app.query([Object3D, FollowCamera])
  const targetQuery = app.query([Object3D, CameraTarget])

  const _mat4 = new Matrix4()
  const _quat = new Quaternion()

  app.spawn([
    LateUpdate,
    new System(app, (dt) => {
      const camera = cameraQuery.first
      const target = targetQuery.first

      if (camera && target) {
        /* Nope, I don't really want to fetch these every frame */
        const targetObj = target.get(Object3D)!
        const cameraObj = camera.get(Object3D)!
        const followCamera = camera.get(FollowCamera)!

        cameraObj.quaternion.slerp(
          _quat.setFromRotationMatrix(
            _mat4
              .copy(cameraObj.matrix)
              .lookAt(cameraObj.position, targetObj.position, cameraObj.up)
          ),
          followCamera.delta
        )
      }
    })
  ])

  return app
}
