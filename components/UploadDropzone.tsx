"use client";

import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FileIcon, UploadIcon } from "lucide-react";
import { ParserState, useParser } from "@/lib/hooks";
import { ACCEPTABLE_FILE_TYPES } from "@/constants/parser-config";
import { humanFileSize } from "@/lib/utils";
import Loader from "./Loader";
import { UploadDropzoneProps } from "@/types";

const Dropzone = ({ setFile }: { setFile?: (file: File) => void }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!setFile) {
        return;
      }
      const file = acceptedFiles[0];
      if (file) {
        setFile(file);
      }
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTABLE_FILE_TYPES,
    multiple: false,
  });
  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
        ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:border-primary"
        }`}
    >
      <input {...getInputProps()} />
      <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        Drag and drop a file here, or click to select a file
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Only .pdf, .docx, .txt, or .md files are accepted
      </p>
    </div>
  );
};

const FileStatus = ({ state, file }: { state: ParserState; file: File }) => {
  return (
    <div className="flex flex-col bg-gray-50 rounded-lg p-4 gap-2 items-center justify-evenly">
      <FileIcon className="h-10 w-10" />
      <div className="p-1 flex flex-col items-center">
        <p className="font-medium">{file.name}</p>
        <p className="text-sm text-gray-500">{humanFileSize(file.size)}</p>
      </div>
      <div className="flex items-center mt-4 m-2">
        {state === "processing" && <Loader text="Parsing the file" />}
        {state === "success" && (
          <span className="text-sm text-orange-600">Parsed</span>
        )}
      </div>
    </div>
  );
};

export default function UploadDropzone({ onFileContent }: UploadDropzoneProps) {
  const { file, setFile, state, text } = useParser();

  useEffect(() => {
    if (state === "success" && text && onFileContent) {
      onFileContent(text);
    }
  }, [state, text, onFileContent]);

  return (
    <div>
      {file ? (
        <FileStatus state={state} file={file} />
      ) : (
        <Dropzone setFile={setFile} />
      )}
    </div>
  );
}
