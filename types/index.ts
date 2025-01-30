import { Editor } from "@tiptap/react";

export type FlowState =
  | "idle"
  | "selected"
  | "processing"
  | "success"
  | "error";

export interface LoaderProps {
  className?: string;
  text: string;
}

export interface RichtextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
}

export interface UploadDropzoneProps {
  onFileContent?: (content: string) => void;
}

export interface UploadViewProps {
  state: FlowState;
  handleContent: (content: string) => void;
  loaderText?: string;
}

export interface EditorViewProps {
  content?: string;
}

export interface MenuBarProps {
  editor: Editor | null;
  onDownload: () => void;
}

export interface MenuButtonProps {
  onClick: () => boolean;
  disabled?: boolean;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
}
