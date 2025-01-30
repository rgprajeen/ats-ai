import { motion } from "framer-motion";
import RichtextEditor from "@/components/RichtextEditor";
import type { EditorViewProps } from "@/types";

export default function EditorView({ content }: EditorViewProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-white z-50 overflow-auto grid items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <RichtextEditor content={content} />
    </motion.div>
  );
}
