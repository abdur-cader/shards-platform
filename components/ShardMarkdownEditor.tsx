"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import { useEffect } from "react";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all } from "lowlight";
import { TableKit } from "@tiptap/extension-table";
import EditorMenu from "./EditorMenu";
import { common, createLowlight } from "lowlight";
const lowlight = createLowlight(common);
interface MarkdownEditorProps {
  defaultContent?: string;
  autoFocus?: boolean;
}

export default function MarkdownEditor({
  defaultContent,
  autoFocus,
}: MarkdownEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        bulletList: {
          HTMLAttributes: { class: "list-disc ml-3" },
        },
        orderedList: {
          HTMLAttributes: { class: "list-decimal ml-3" },
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
      Subscript,
      Superscript,
      TableKit.configure({
        table: { resizable: true },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "plaintext",
      }),
    ],
    content: defaultContent,
    autofocus: autoFocus ? "end" : false,
    editorProps: {
      attributes: {
        class:
          "max-w-none border rounded-lg p-3 focus:outline-none min-h-[200px]",
      },
    },
  });
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);
  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
}
