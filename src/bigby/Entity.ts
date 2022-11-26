import { With } from "@miniplex/core"
import { vec3 } from "gl-matrix"
import { Camera } from "./core/Camera"
import { Mesh } from "./core/Mesh"
import { Transform } from "./core/Transform"

export type Entity = {
  transform?: Transform
  parent?: With<Entity, "transform">
  mesh?: Mesh
  camera?: Camera
  autorotate?: vec3
}
