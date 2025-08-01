"use client";

import { useSearchParams } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { TableKit } from "@tiptap/extension-table";
import { useEffect } from "react";
import EditorMenu from "./EditorMenu";

import { common, createLowlight } from "lowlight";
const lowlight = createLowlight(common);

interface Props {
  initialMarkdown: string;
}

export default function ShardContent({ initialMarkdown }: Props) {
  const searchParams = useSearchParams();
  const isEditing = searchParams?.get("edit") === "1";

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // disable built-in to use lowlight
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
    content: initialMarkdown || "",
    autofocus: isEditing ? "end" : false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "max-w-none border rounded-lg p-3 focus:outline-none min-h-[200px]",
      },
    },
  });

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  if (isEditing && editor) {
    return (
      <div>
        <EditorMenu editor={editor} />
        <div className="tableWrapper">
          <EditorContent editor={editor} />
        </div>
      </div>
    );
  }

  return (
    <div className="prose max-w-none border rounded-lg p-3 min-h-[200px]">
      {initialMarkdown || "`no content yet`"}
    </div>
  );
}
