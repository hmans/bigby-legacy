import { Constructor } from "./types"

export type ApplyProps<T> = Partial<T>

export const apply = <T extends object>(object: T, props: ApplyProps<T>) => {
  Object.assign(object, props)
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
}

export const make = <C extends Constructor<any>>(
  ctor: C,
  { args, ...props }: MakeProps<C> = {},
  fun?: (object: InstanceType<C>) => void
): InstanceType<C> => {
  // @ts-ignore
  const instance = args ? new ctor(...args) : new ctor()
  const applied = apply(instance, props)
  fun?.(applied)
  return applied
}

export const c = make
