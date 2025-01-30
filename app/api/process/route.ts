import { graph, outputToReadableStream } from "@/lib/agent";

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const POST = async (request: NextRequest) => {
  const text = await request.text();

  const input = {
    messages: [
      {
        role: "user",
        content: text,
      },
    ],
  };

  const result = await graph.stream(input, {
    streamMode: "updates",
  });

  return new NextResponse(outputToReadableStream(result), {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
    status: 201,
  });
};
