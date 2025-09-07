import { tool } from "@langchain/core/tools"
import z from "zod"

export const createEventTool = tool(
    async () => {
        return `The meeting has been created`
    },
    {
        name: "Ceate Event Tool",
        description: "Call to create a event.",
        schema: z.object({})
    }
)

export const getEventTool = tool(
    async () => {
        return `[name: "Meeting with Sujoy" ,date: "7th September" ,topic:"New Year Party plans"]`
    },
    {
        name: "Get Events Tool",
        description: "Call to get a event.",
        schema: z.object({})
    }
)