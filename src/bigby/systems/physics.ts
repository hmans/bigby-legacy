import { World } from "@miniplex/core"
import { Entity } from "../Entity"
import * as RAPIER from "@dimforge/rapier3d"

export default (world: World<Entity>) => {
  const physics = new RAPIER.World({ x: 0, y: -9.81, z: 0 })

  return (dt: number) => {
    physics.timestep = dt
    physics.step()
  }
}
