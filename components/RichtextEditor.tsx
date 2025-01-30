"use client";

import type React from "react";
import { useCallback } from "react";
import { EditorContent } from "@tiptap/react";
import { useTipTapEditor } from "@/lib/hooks";
import { MenuBar } from "./MenuBar";
import { RichtextEditorProps } from "@/types";

export default function RichtextEditor({
  content,
  onChange,
}: RichtextEditorProps) {
  const editor = useTipTapEditor(content, onChange);

  const handleDownload = useCallback(async () => {
    if (!editor) return;

    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html: editor.getHTML() }),
      });

      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden m-10">
      <MenuBar editor={editor} onDownload={handleDownload} />
      <EditorContent editor={editor} />
    </div>
  );
}
