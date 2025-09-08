import { ChatGroq } from "@langchain/groq";
import { createEventTool, getEventTool } from "./tools";
import { END, MemorySaver, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import type { AIMessage } from "@langchain/core/messages";
import { createInterface } from "node:readline/promises"
import { stdin, stdout } from "node:process";

const tools = [createEventTool, getEventTool]

const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0
}).bindTools(tools)

async function callTheModel(state: typeof MessagesAnnotation.State) {
    // console.log("Calling the LLM");
    const response = await llm.invoke(state.messages)
    return { messages: [response] }
}

const toolNode = new ToolNode(tools)

const goTo = (state: typeof MessagesAnnotation.State) => {
    const lastMessage = state.messages[state.messages.length - 1] as AIMessage
    if (lastMessage.tool_calls?.length) {
        return "tools"
    }
    return "__end__"
}

const graph = new StateGraph(MessagesAnnotation)
    .addNode("llm", callTheModel)
    .addNode("tools", toolNode)
    .addEdge("__start__", "llm")
    .addEdge("tools", "llm")
    .addConditionalEdges("llm", goTo, {
        __end__: END,
        tools: "tools"
    })

const checkpointer = new MemorySaver()

const app = graph.compile({ checkpointer })

const rl = createInterface({ input: stdin, output: stdout })

async function main() {
    while (true) {
        const userQuery = await rl.question("You: ")
        if (userQuery === "bye") {
            break
        }
        const result = await app.invoke({
            messages: [
                {
                    role: "user",
                    content: userQuery
                }
            ]
        }, { configurable: { thread_id: 1 } })
        console.log("Assistant: ", result.messages[result.messages.length - 1]?.content);
    }

    rl.close()
}

main()