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
import { useEffect, useState } from "react";
import EditorMenu from "./EditorMenu";
import { useSession } from "next-auth/react";
import { common, createLowlight } from "lowlight";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const lowlight = createLowlight(common);

interface Props {
  initialMarkdown: string;
  slug: string;
  isOwner: boolean;
}

export default function ShardContent({
  initialMarkdown,
  slug,
  isOwner,
}: Props) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const isEditing = searchParams?.get("edit") === "1";

  const [content, setContent] = useState<any>(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  // const [isOwner, setIsOwner] = useState(false);
  // const [isCheckingOwner, setIsCheckingOwner] = useState(false);

  // // Check ownership when session or slug changes
  // useEffect(() => {
  //   const verifyOwnership = async () => {
  //     if (!session?.user?.id) {
  //       setIsOwner(false);
  //       return;
  //     }

  //     setIsCheckingOwner(true);
  //     try {
  //       const headers: HeadersInit = {
  //         "Content-Type": "application/json",
  //       };

  //       if (session?.supabaseAccessToken) {
  //         headers["sb-access-token"] = session.supabaseAccessToken;
  //       }

  //       const response = await fetch(
  //         `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/shards/${slug}/verify-owner`,
  //         {
  //           method: "POST",
  //           headers,
  //           body: JSON.stringify({ userId: session.user.id }),
  //         }
  //       );

  //       const data = await response.json();
  //       setIsOwner(data.isOwner);
  //     } catch (error) {
  //       console.error("Error verifying ownership:", error);
  //       setIsOwner(false);
  //     } finally {
  //       setIsCheckingOwner(false);
  //     }
  //   };

  //   verifyOwnership();
  // }, [session, slug]);

  // unified extensions config
  const extensions = [
    StarterKit.configure({
      codeBlock: false,
      bulletList: {
        HTMLAttributes: { class: "list-disc ml-3" },
      },
      orderedList: {
        HTMLAttributes: { class: "list-decimal ml-3" },
      },
      paragraph: {
        HTMLAttributes: {
          class: "mb-4 last:mb-0",
        },
      },
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
      defaultAlignment: "left",
    }),
    Highlight.configure({
      multicolor: true,
    }),
    Subscript,
    Superscript,
    TableKit.configure({
      table: {
        resizable: true,
        HTMLAttributes: {
          class: "my-4",
        },
      },
    }),
    CodeBlockLowlight.configure({
      lowlight,
      defaultLanguage: "plaintext",
      HTMLAttributes: {
        class: "hljs rounded-md",
      },
    }),
  ];

  // fetch shard content
  useEffect(() => {
    const fetchShard = async () => {
      try {
        const res = await fetch(`/api/shards/${slug}`);
        const data = await res.json();
        setContent(data.shard?.content || null);
      } catch (error) {
        console.error("Error fetching shard:", error);
        setContent({ type: "doc", content: [] });
      }
    };
    fetchShard();
  }, [slug]);

  // editing editor
  const editEditor = useEditor({
    extensions,
    immediatelyRender: false,
    content: content || "",
    autofocus: isEditing ? "end" : false,
    editorProps: {
      attributes: {
        class:
          "prose tiptap max-w-none border rounded-lg p-6 focus:outline-none min-h-[200px]",
      },
    },
  });

  // readonly editor
  const readOnlyEditor = useEditor({
    extensions,
    immediatelyRender: false,
    content: content || "",
    editable: false,
    editorProps: {
      attributes: {
        class: "prose tiptap max-w-none border rounded-lg p-6 min-h-[200px]",
      },
    },
  });

  // sync editors when content changes
  useEffect(() => {
    if (editEditor && content) {
      editEditor.commands.setContent(content);
    }
    if (readOnlyEditor && content) {
      readOnlyEditor.commands.setContent(content);
    }
  }, [editEditor, readOnlyEditor, content]);

  const handleSave = async () => {
    if (!editEditor) return;

    try {
      const jsonContent = editEditor.getJSON();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (session?.supabaseAccessToken) {
        headers["sb-access-token"] = session.supabaseAccessToken;
      }

      await fetch(`/api/shards/${slug}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ content: jsonContent }),
      });

      // Remove URL parameters and refresh the page
      window.location.href = window.location.pathname;
    } catch (error) {
      console.error("Error saving shard:", error);
    }
  };

  const handleDiscardChanges = () => {
    if (editEditor && content) {
      editEditor.commands.setContent(content);
    }
    setShowDiscardModal(false);
    // Remove URL parameters after discarding changes
    window.history.replaceState(null, "", window.location.pathname);
  };

  // editing mode - only show if user is owner and isEditing is true
  if (isEditing && editEditor && isOwner) {
    return (
      <div className="space-y-4">
        <EditorMenu editor={editEditor} />
        <div className="tableWrapper">
          <EditorContent editor={editEditor} />
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="px-6 py-2 relative overflow-hidden rounded-lg 
              border border-gray-600
              bg-gradient-to-r from-zinc-800 to-zinc-700 
              text-zinc-100 shadow-md
              transition-all duration-300 ease-in-out
              hover:scale-105 
              hover:from-lime-800 hover:to-lime-700
              hover:border-lime-500
              group
            "
          >
            <span className="gap-2 relative z-10 flex items-center justify-center font-medium">
              Save Changes
            </span>

            <span
              className="absolute inset-0 w-[300%]
                bg-gradient-to-r from-transparent
                via-[rgba(190,242,100,0.25)] to-transparent
                -translate-x-[130%] group-hover:translate-x-0
                transition-transform duration-400 ease-in-out
                will-change-transform
              "
            />
          </button>

          <button
            onClick={() => setShowDiscardModal(true)}
            className="px-6 py-2 relative overflow-hidden rounded-lg 
              border border-gray-600
              bg-gradient-to-r from-zinc-800 to-zinc-700 
              text-zinc-100 shadow-md border-red-900 
              transition-all duration-300 ease-in-out
              hover:scale-105 
              hover:from-red-800 hover:to-red-700
              hover:border-red-500
              group
            "
          >
            <span className="gap-2 relative z-10 flex items-center justify-center font-medium">
              Discard Changes
            </span>

            <span
              className="absolute inset-0 w-[300%]
                bg-gradient-to-r from-transparent
                via-[rgba(239,68,68,0.25)] to-transparent
                -translate-x-[130%] group-hover:translate-x-0
                transition-transform duration-700 ease-in-out
                will-change-transform
              "
            />
          </button>
        </div>

        <AlertDialog open={showDiscardModal} onOpenChange={setShowDiscardModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will discard all your changes and revert to the last saved
                version.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDiscardChanges}
                className="bg-red-800 text-white hover:bg-red-900 "
              >
                Discard Changes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // readonly mode
  return (
    <div className="tableWrapper">
      <EditorContent editor={readOnlyEditor} />

      {isOwner && (
        <button
          onClick={() => {
            const url = new URL(window.location.href);
            url.searchParams.set("edit", "1");
            window.location.href = url.href;
          }}
          className="mt-4 mr-4 mb-4 ml-1 px-6 py-1 relative overflow-hidden rounded-lg 
        border border-gray-600
        bg-gradient-to-r from-zinc-800 to-zinc-700 
        text-zinc-100 shadow-md
        transition-all duration-300 ease-in-out
        hover:scale-105 
        hover:from-lime-800 hover:to-lime-700
        hover:border-lime-500
        group text-sm
      "
        >
          Edit
        </button>
      )}
    </div>
  );
}
