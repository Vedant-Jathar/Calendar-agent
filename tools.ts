import { tool } from "@langchain/core/tools"
import z from "zod"

export const createEventTool = tool(
    async () => {
        return `The meeting has been created`
    },
    {
        name: "Ceate_Event_Tool",
        description: "Call to create a event",
        schema: z.object({
            query: z.string().describe("This is the query with the help of which a event has to be created in the google calendar")
        })
    }
)

export const getEventTool = tool(
    async () => {
        return `[name: "Meeting with Sujoy" ,date: "7th September" ,topic:"New Year Party plans"]`
    },
    {
        name: "Get_Events_Tool",
        description: "Call to get a event.",
        schema: z.object({
            query: z.string().describe("This is the query with the help of which we will get the event from the google calendar ")
        })
    }
)