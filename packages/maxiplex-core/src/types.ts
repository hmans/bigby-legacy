import { Function } from "ts-toolbelt"

export type Component = any

export type ComponentQuery<C extends Component> = Function.Narrow<{
  [K in keyof C]: AbstractConstructor<C[K]>
}>

export type AbstractConstructor<T> = abstract new (...args: any[]) => T

export type Constructor<T> = new (...args: any[]) => T
