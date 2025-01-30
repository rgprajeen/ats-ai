"use client";

export const ACCEPTABLE_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "text/markdown": [".md"],
  "text/plain": [".txt"],
};

export const SUPPORTED_FILE_TYPES = Object.keys(ACCEPTABLE_FILE_TYPES);
