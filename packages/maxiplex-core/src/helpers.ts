import { Color, ColorRepresentation, Vector3 } from "three"
import { Component, Constructor } from "./types"

export type ApplyProps<T> = Partial<{
  [K in keyof T]: T[K] extends Color
    ? ColorRepresentation
    : T[K] extends Vector3
    ? Vector3 | [number, number, number]
    : T[K]
}>

export const apply = <T extends object>(object: T, props: ApplyProps<T>) => {
  for (const key in props) {
    const o = object[key] as any
    const value = props[key] as any

    /* Use setScalar if available */
    if (o?.setScalar && typeof value === "number") {
      o.setScalar(value)
      continue
    }

    /* Use copy if available */
    if (o?.copy && o.constructor === value.constructor) {
      o.copy(value)
      continue
    }

    /* Use set if available */
    if (o?.set) {
      Array.isArray(value) ? o.set(...value) : o.set(value)
      continue
    }

    if (key in object) {
      // @ts-ignore
      object[key] = props[key]
    }
  }

  return object
}

export const setup = <T extends object>(object: T, fun: (object: T) => any) => {
  fun(object)
  return object
}

export type MakeProps<C extends Constructor<any>> = ApplyProps<
  InstanceType<C>
> & {
  args?: ConstructorParameters<C>
  setup?: (object: InstanceType<C>) => any
}

export const make = <C extends Constructor<any>>(
  ctor: C,
  { args, setup, ...props }: MakeProps<C> = {},
  fun?: (object: InstanceType<C>) => void
): InstanceType<C> => {
  // @ts-ignore
  const instance = args ? new ctor(...args) : new ctor()
  const applied = apply(instance, props)
  fun?.(applied)
  setup?.(applied)
  return applied
}

export const c = make

export const processComponent = <C extends Component>(
  c: C | Constructor<C>
): C => {
  // @ts-ignore
  return typeof c === "function" ? new c() : c
}
