"use client";

import { useSearchParams } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import { TableKit } from "@tiptap/extension-table";
import { useEffect } from "react";
import EditorMenu from "./EditorMenu";

interface Props {
  initialMarkdown: string;
}

export default function ShardContent({ initialMarkdown }: Props) {
  const searchParams = useSearchParams();
  const isEditing = searchParams?.get("edit") === "1";

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
        link: {
          protocols: ["ftp", "http", "https", "mailto", "tel"],
          autolink: true,
          enableClickSelection: true,
          linkOnPaste: true,
          defaultProtocol: "https",
          HTMLAttributes: {
            class: "underline text-emerald-900 hover:cursor-pointer",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Subscript,
      Superscript,
      TableKit.configure({
        table: { resizable: true },
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
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (isEditing && editor) {
    return (
      <div>
        <EditorMenu editor={editor} />
        <EditorContent editor={editor} />
      </div>
    );
  }

  return (
    <div className="prose max-w-none border rounded-lg p-3 min-h-[200px]">
      {initialMarkdown || "`no content yet`"}
    </div>
  );
}
