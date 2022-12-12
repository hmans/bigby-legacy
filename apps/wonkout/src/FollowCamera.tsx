import { App, System } from "bigby"
import { Matrix4, Object3D, Quaternion } from "three"

const _mat4 = new Matrix4()
const _quat = new Quaternion()

export class FollowCamera {
  delta = 0.01
}

export class CameraTarget {}

class FollowCameraSystem extends System {
  cameraQuery = this.app.query([Object3D, FollowCamera])
  targetQuery = this.app.query([Object3D, CameraTarget])

  onLateUpdate(dt: number): void {
    const camera = this.cameraQuery.first
    const target = this.targetQuery.first

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
  }
}

export function FollowCameraPlugin(app: App) {
  app.registerComponent(CameraTarget)
  app.registerComponent(FollowCamera)

  app.spawn([new FollowCameraSystem(app)])

  return app
}
