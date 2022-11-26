import { With } from "@miniplex/core"
import { vec3 } from "gl-matrix"
import { Mesh } from "./core/Mesh"
import { Transform } from "./core/Transform"

export type Entity = {
  transform?: Transform
  parent?: With<Entity, "transform">
  mesh?: Mesh
  autorotate?: vec3
}
