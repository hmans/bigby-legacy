import { createReactAPI } from "@bigby/react"
import { App } from "bigby"

export const app = new App()

export const ECS = createReactAPI(app)
