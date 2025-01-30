"use client";

import { motion, AnimatePresence } from "framer-motion";
import UploadView from "@/components/UploadView";
import EditorView from "@/components/EditorView";
import { useProcessFile } from "@/lib/hooks";

export default function Home() {
  const { state, processedText, loaderText, processFile } = useProcessFile();

  const handleContent = (content: string) => {
    processFile(content);
  };

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {state !== "success" ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <UploadView
              state={state}
              handleContent={handleContent}
              loaderText={loaderText}
            />
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <EditorView content={processedText} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
