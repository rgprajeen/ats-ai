import {
  END,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";
import type { IterableReadableStream } from "@langchain/core/utils/stream";
import { makeAgentNode } from "./factory";
import {
  ANONYMIZER_PROMPT,
  ENHANCER_PROMPT,
  FORMATTER_PROMPT,
  LINGUIST_PROMPT,
  ORCHESTRATOR_PROMPT,
} from "./prompts";

// Define types for better type safety
type NodeName =
  | "anonymizer"
  | "formatter"
  | "enhancer"
  | "linguist"
  | "orchestrator";
type NodeDestination = NodeName | typeof END;

interface NodeConfig {
  name: NodeName;
  destinations: NodeDestination[];
  systemPrompt: string;
}

// Define node configurations
const nodeConfigs: NodeConfig[] = [
  {
    name: "anonymizer",
    destinations: ["orchestrator", "linguist"],
    systemPrompt: ANONYMIZER_PROMPT,
  },
  {
    name: "formatter",
    destinations: ["orchestrator", "enhancer", "linguist"],
    systemPrompt: FORMATTER_PROMPT,
  },
  {
    name: "enhancer",
    destinations: ["orchestrator", "linguist"],
    systemPrompt: ENHANCER_PROMPT,
  },
  {
    name: "linguist",
    destinations: ["orchestrator"],
    systemPrompt: LINGUIST_PROMPT,
  },
  {
    name: "orchestrator",
    destinations: ["anonymizer", "formatter", "linguist", "enhancer", END],
    systemPrompt: ORCHESTRATOR_PROMPT,
  },
];

// Create nodes using the configurations
const nodes = nodeConfigs.reduce((acc, config) => {
  acc[config.name] = makeAgentNode({ ...config });
  return acc;
}, {} as Record<NodeName, ReturnType<typeof makeAgentNode>>);

// Create the workflow
const workflow = new StateGraph(MessagesAnnotation);

// Add nodes to the workflow
nodeConfigs.forEach((config) => {
  workflow.addNode(config.name, nodes[config.name], {
    ends: config.destinations,
  });
});

// Add the starting edge
// @ts-expect-error No type inference for dynamic graph nodes
workflow.addEdge(START, "orchestrator");

export const graph = workflow.compile();

// Improved type definitions
export interface StreamIn {
  messages: {
    role: string;
    content: string;
    name: NodeName;
  };
}

export interface Stream {
  [k: string]: StreamIn;
}

export interface StreamOut {
  status: "processing" | "error" | "success";
  message: string;
  content?: string;
}

const processStateUpdate = (state: StreamIn): StreamOut | undefined => {
  const processingMessages: Record<NodeName, string> = {
    anonymizer: "Anonymizing the content for privacy",
    enhancer: "Enhancing the processed content",
    formatter: "Formatting the resulting content",
    linguist: "Rephrasing the content for clarity",
    orchestrator: "Evaluating the processed content",
  };

  const message = processingMessages[state.messages.name];
  return message ? { status: "processing", message } : undefined;
};

export const outputToReadableStream = (
  output: IterableReadableStream<Stream>
): ReadableStream<string> => {
  return new ReadableStream({
    async start(controller) {
      const initialMessage: StreamOut = {
        status: "processing",
        message: "Receiving the contents of the file",
      };
      const encodedMessage = Buffer.from(
        JSON.stringify(initialMessage)
      ).toString("base64");
      controller.enqueue(encodedMessage + "\n");
    },
    async pull(controller) {
      let lastUpdate: StreamIn | null = null;
      for await (const chunk of output) {
        lastUpdate = Object.values(chunk)[0];
        const processed = processStateUpdate(lastUpdate);
        if (processed) {
          const encodedMessage = Buffer.from(
            JSON.stringify(processed)
          ).toString("base64");
          controller.enqueue(encodedMessage + "\n");
        }
      }
      const finalMessage: StreamOut = {
        status: "success",
        message: "Processing completed",
        content: lastUpdate?.messages.content,
      };
      const encodedFinalMessage = Buffer.from(
        JSON.stringify(finalMessage)
      ).toString("base64");
      controller.enqueue(encodedFinalMessage + "\n");
      controller.close();
    },
  });
};
