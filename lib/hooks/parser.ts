"use client";

import PizZip from "pizzip";
import { marked } from "marked";
import { useEffect, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import Tesseract from "tesseract.js";
import { SUPPORTED_FILE_TYPES } from "@/constants/parser-config";

type ParserFunc = (file: File) => Promise<string>;

export type ParserState = "idle" | "processing" | "success" | "error";

export const useParser = (initial?: File) => {
  const [file, setFile] = useState(initial);
  const [state, setState] = useState<ParserState>("idle");
  const [text, setText] = useState<string>();

  useEffect(() => {
    if (!file) {
      return;
    }
    setState("processing");

    const type = file?.type;
    if (!SUPPORTED_FILE_TYPES.includes(type)) {
      setState("error");
      return;
    }

    let parser: ParserFunc | null = null;
    switch (type) {
      case "application/pdf":
        parser = parsePdf;
        break;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        parser = parseWord;
        break;
      case "text/markdown":
        parser = parseMarkdown;
        break;
      case "text/plain":
        parser = parseText;
        break;
      default:
        setState("error");
        return;
    }

    if (parser) {
      parser(file).then((text) => {
        setText(text);
        setState("success");
      });
    }

    return () => {
      setState("idle");
      setFile(initial);
      setText(undefined);
    };
  }, [file, initial]);

  return {
    file,
    setFile,
    state,
    text,
  };
};

const parseText = async (f: File) => (f.text ? f.text() : "");

const str2xml = (str: string) => {
  if (str.charCodeAt(0) === 65279) {
    str = str.slice(1);
  }
  return new DOMParser().parseFromString(str, "text/xml");
};

const parseWord = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  try {
    const zip = new PizZip(arrayBuffer);
    if (!zip) {
      throw new Error("Word document not found");
    }
    const xml = str2xml(zip.files["word/document.xml"].asText());
    const paragraphsXml = xml.getElementsByTagName("w:p");
    const paragraphs = [];

    for (let i = 0, len = paragraphsXml.length; i < len; i++) {
      let fullText = "";
      const textsXml = paragraphsXml[i].getElementsByTagName("w:t");
      for (let j = 0, len2 = textsXml.length; j < len2; j++) {
        const textXml = textsXml[j];
        if (textXml.childNodes) {
          fullText += textXml.childNodes[0].nodeValue;
        }
      }

      paragraphs.push(fullText);
    }
    return paragraphs.join("\n");
  } catch {
    throw new Error("Failed to loade Word document");
  }
};

const parsePdf = async (file: File): Promise<string> => {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  const scale = 1.5;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to create canvas context");
  }

  let documentContents = "";
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: scale });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
    const content = await Tesseract.recognize(canvas);
    documentContents += content.data.text + "\n";
  }
  return documentContents;
};

const parseMarkdown = async (file: File) => {
  const markdown = await file.text();
  const htmlString = await marked(markdown);
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const walker = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT);

  const textList = [];
  let currentNode: Node | null = walker.currentNode;

  while (currentNode) {
    textList.push(currentNode.textContent);
    currentNode = walker.nextNode();
  }

  return textList.join();
};
