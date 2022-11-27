import { With } from "@miniplex/core"
import { vec3 } from "gl-matrix"
import { Camera } from "./core/Camera"
import { Mesh } from "./core/Mesh"
import { Transform } from "./core/Transform"
import { RigidBody } from "./plugins/physics"

export type Entity = {
  transform?: Transform
  parent?: With<Entity, "transform">
  mesh?: Mesh
  camera?: Camera
  autorotate?: vec3
  rigidbody?: RigidBody
}
