import { Constructor } from "./types"

export type ApplyProps<T> = Partial<T>

export const apply = <T extends object>(
  object: T,
  props: ApplyProps<T>,
  fun?: (object: T) => any
) => {
  Object.assign(object, props)
  fun?.(object)
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
