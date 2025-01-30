import { useState, useCallback } from "react";
import type { FlowState } from "@/types";

export function useProcessFile() {
  const [state, setState] = useState<FlowState>("idle");
  const [loaderText, setLoaderText] = useState<string>();
  const [processedText, setProcessedText] = useState<string>();

  const processFile = useCallback(async (contents: string) => {
    setState("processing");
    setLoaderText("Uploading the file contents");

    try {
      const response = await fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: contents,
      });

      const reader = response.body
        ?.pipeThrough(new TextDecoderStream())
        .getReader();

      if (!reader) {
        throw new Error("No reader available");
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += value;
        const lines = buffer.split("\n");

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i];
          if (line) {
            const message = JSON.parse(atob(line));
            if (message.status === "processing") {
              setLoaderText(message.message);
            } else if (message.status === "success") {
              setProcessedText(message.content);
              setState("success");
            } else {
              setState("error");
            }
          }
        }

        buffer = lines[lines.length - 1];
      }
    } catch (error) {
      console.error(error);
      setState("error");
    }
  }, []);

  return { state, processedText, loaderText, processFile };
}
