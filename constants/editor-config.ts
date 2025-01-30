import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";

export const EDITOR_EXTENSIONS = [
  StarterKit.configure({
    codeBlock: false,
  }),
  Highlight,
  TaskList,
  TaskItem,
  Placeholder.configure({
    placeholder: "Write something...",
  }),
];

export const EDITOR_PROPS = {
  attributes: {
    class:
      "prose dark:prose-invert max-w-none w-full p-4 focus:outline-none min-h-[200px] max-h-[600px] overflow-y-auto",
  },
};
