import { ChatGroq } from "@langchain/groq";

const tools: any = []

const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0
}).bindTools(tools)