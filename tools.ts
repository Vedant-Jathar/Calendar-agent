import { tool } from "@langchain/core/tools"
import z from "zod"
import { google } from "googleapis"
import tokens from "./tokens.json"

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URL,
);

oauth2Client.setCredentials(tokens)

const calendar = google.calendar({ version: "v3", auth: oauth2Client })

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

type Params = {
    q: string,
    timeMin: string,
    timeMax: string
}

export const getEventTool = tool(
    async (params) => {
        try {
            console.log("params: ", params);

            const { q, timeMin, timeMax } = params as Params

            const response = await calendar.events.list({
                calendarId: "jatharvedant16@gmail.com",
                q, timeMin, timeMax
            })

            const events = response.data.items?.map(event => {
                return {
                    id: event.id,
                    summary: event.summary,
                    eventType: event.eventType,
                    status: event.status,
                    start: event.start,
                    end: event.end,
                    organizer: event.organizer,
                    attendees: event.attendees,
                    meetingLink: event.hangoutLink
                }
            })

            console.log("events: ", events);

            return JSON.stringify(events)
        } catch (error) {
            console.log("Error:", error);
        }

        return "Failed to get events"
    },
    {
        name: "Get_Events_Tool",
        description: "Call to get a event.",
        schema: z.object({
            q: z.string().describe("This is the text search term to find events that match these terms in the following fields:summary,description ,location, attendee's displayName,attendee's email,organizer's displayName,organizer's email"),
            timeMin: z.string().describe("This is the start date_time of the event in UTC format"),
            timeMax: z.string().describe("This is the end date_time of the event in UTC format"),
        })
    }
)