import { Function } from "ts-toolbelt"

export type Component = any
export type Entity = Component[]

export type ComponentQuery<C extends Component> = Function.Narrow<{
  [K in keyof C]: Constructor<C[K]>
}>

export type Constructor<T> = new (...args: any[]) => T
