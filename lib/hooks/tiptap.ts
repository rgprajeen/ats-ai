import { useEditor } from "@tiptap/react";
import { EDITOR_EXTENSIONS, EDITOR_PROPS } from "@/constants/editor-config";

export const useTipTapEditor = (
  content?: string,
  onChange?: (content: string) => void
) => {
  return useEditor({
    extensions: EDITOR_EXTENSIONS,
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: EDITOR_PROPS,
    immediatelyRender: false,
  });
};
