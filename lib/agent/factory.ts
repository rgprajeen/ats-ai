import { Command, END, MessagesAnnotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY,
});

interface MakeAgentParams {
  name: string;
  destinations: string[];
  systemPrompt: string;
}

export const makeAgentNode = ({
  name,
  destinations,
  systemPrompt,
}: MakeAgentParams) => {
  return async (state: typeof MessagesAnnotation.State) => {
    if (destinations.length === 0) {
      destinations = [END];
    }
    const possibleDestinations = [
      destinations[0],
      ...destinations.slice(1),
    ] as const;

    const responseSchema = z.object({
      response: z
        .string()
        .describe(
          "The result of the user data that was processed. Does not need to be the fully processed data. It has to be only for the processed completed at this stage."
        ),
      goto: z
        .enum(possibleDestinations)
        .describe(
          `The next agent to call, or ${END} if the user goal has been achieved. Must be one of the given values only.`
        ),
    });

    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...state.messages,
    ];

    const response = await model
      .withStructuredOutput(responseSchema, {
        name: "router",
      })
      .invoke(messages);

    const aiMessage = {
      role: "assistant",
      content: response.response,
      name,
    };

    return new Command({
      goto: response.goto,
      update: { messages: aiMessage },
    });
  };
};
