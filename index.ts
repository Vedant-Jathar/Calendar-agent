import { ChatGroq } from "@langchain/groq";
import { createEventTool, getEventTool } from "./tools";

const tools = [createEventTool, getEventTool]

const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0
}).bindTools(tools)