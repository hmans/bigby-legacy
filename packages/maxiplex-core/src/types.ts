import { Function } from "ts-toolbelt"

export type Component = any

export type ComponentQuery<C extends Component> = Function.Narrow<{
  [K in keyof C]: Constructor<C[K]>
}>

export type Constructor<T> =
  | (abstract new (...args: any[]) => T)
  | NonAbstractConstructor<T>

export type NonAbstractConstructor<T> = new (...args: any[]) => T
