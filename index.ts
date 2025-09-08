import { ChatGroq } from "@langchain/groq";
import { createEventTool, getEventTool } from "./tools";
import { END, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import type { AIMessage } from "@langchain/core/messages";

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

const app = graph.compile()

async function main() {
    const result = await app.invoke({
        messages: [
            {
                role: "user",
                content: "When is Physics confernce?"
            }
        ]
    })

    console.log("result:", result.messages[result.messages.length - 1]?.content);
}

main()