import { Constructor } from "./types"

export type ApplyProps<T> = Partial<T>

export const apply = <T extends object>(object: T, props: ApplyProps<T>) => {
  Object.assign(object, props)
  return object
}

export type MakeProps<C extends Constructor<any>> = ApplyProps<
  InstanceType<C>
> & {
  args?: ConstructorParameters<C>
}

export const make = <C extends Constructor<any>>(
  ctor: C,
  args?: ConstructorParameters<C>,
  props: MakeProps<C> = {}
): InstanceType<C> => {
  // @ts-ignore
  const instance = args ? new ctor(...args) : new ctor()
  return apply(instance, props)
}

export const c = make
