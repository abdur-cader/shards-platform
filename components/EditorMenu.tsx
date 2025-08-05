import React, { useState, useEffect, useRef } from "react";
import type { Editor } from "@tiptap/react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Pilcrow,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  CodeSquare,
  Undo,
  Redo,
  Underline,
  Highlighter,
  Link,
  Table,
  Rows,
  Columns,
  Merge,
  Split,
  Trash2,
  Superscript,
  Subscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
} from "lucide-react";
import { MdOutlineFilterListOff } from "react-icons/md";
import { Toggle } from "@/components/ui/toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function EditorMenu({ editor }: { editor: Editor }) {
  const [linkUrl, setLinkUrl] = useState("");
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const linkButtonRef = useRef<HTMLButtonElement>(null);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive("code") ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        isUnderline: ctx.editor.isActive("underline") ?? false,
        canUnderline: ctx.editor.can().chain().toggleUnderline().run() ?? false,
        isHighlight: ctx.editor.isActive("highlight") ?? false,
        canHighlight: ctx.editor.can().chain().toggleHighlight().run() ?? false,
        isLink: ctx.editor.isActive("link") ?? false,
        canLink: ctx.editor.can().chain().toggleLink().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive("paragraph") ?? false,
        isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        isTaskList: ctx.editor.isActive("taskList") ?? false,
        isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
        isBlockquote: ctx.editor.isActive("blockquote") ?? false,
        isSuperscript: ctx.editor.isActive("superscript") ?? false,
        isSubscript: ctx.editor.isActive("subscript") ?? false,
        isLeftAlign: ctx.editor.isActive({ textAlign: "left" }) ?? false,
        isCenterAlign: ctx.editor.isActive({ textAlign: "center" }) ?? false,
        isRightAlign: ctx.editor.isActive({ textAlign: "right" }) ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
        selectedText: ctx.editor.state.selection.empty
          ? ""
          : ctx.editor.state.doc.textBetween(
              ctx.editor.state.selection.from,
              ctx.editor.state.selection.to,
              ""
            ),
      };
    },
  });

  useEffect(() => {
    if (isLinkPopoverOpen && linkInputRef.current) {
      linkInputRef.current.focus();
    }
  }, [isLinkPopoverOpen]);

  const handleLinkToggle = () => {
    if (editorState.isLink) {
      // If link is active, remove it
      editor.chain().focus().unsetLink().run();
      setIsLinkPopoverOpen(false);
      return;
    }

    // Open the popover to enter the URL
    setIsLinkPopoverOpen(true);
    setLinkUrl("");
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!linkUrl.trim()) {
      setIsLinkPopoverOpen(false);
      return;
    }

    const { selectedText } = editorState;

    if (selectedText) {
      // If text is selected, set link on that text
      editor.chain().focus().setLink({ href: linkUrl }).run();
    } else {
      // If no text selected, enable link mode for next text
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }

    setIsLinkPopoverOpen(false);
    setLinkUrl("");
  };

  const getActiveHeading = () => {
    if (editorState.isHeading1) return <Heading1 className="h-4 w-4" />;
    if (editorState.isHeading2) return <Heading2 className="h-4 w-4" />;
    if (editorState.isHeading3) return <Heading3 className="h-4 w-4" />;
    if (editorState.isHeading4) return <Heading4 className="h-4 w-4" />;
    return <Pilcrow className="h-4 w-4" />;
  };

  const getActiveList = () => {
    if (editorState.isBulletList) return <List className="h-4 w-4" />;
    if (editorState.isOrderedList) return <ListOrdered className="h-4 w-4" />;
    if (editorState.isTaskList) return <ListChecks className="h-4 w-4" />;
    return <MdOutlineFilterListOff className="h-4 w-4" />;
  };

  const MENU_OPTIONS = [
    {
      icon: <Undo className="h-4 w-4" />,
      command: (editor: Editor) => editor.chain().focus().undo().run(),
      isEnabled: (state: typeof editorState) => state.canUndo,
    },
    {
      icon: <Redo className="h-4 w-4" />,
      command: (editor: Editor) => editor.chain().focus().redo().run(),
      isEnabled: (state: typeof editorState) => state.canRedo,
    },
    { separator: true },
    {
      component: (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-1 p-1 rounded hover:bg-lime-900/25 hover:text-white transition-colors"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.commands.focus();
            }}
          >
            <Table className="h-4 w-4" />
            <ChevronDown className="h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[180px] bg-black">
            <DropdownMenuItem
              onMouseDown={(e) => e.preventDefault()}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows: 2, cols: 2, withHeaderRow: true })
                  .run()
              }
              className="flex items-center gap-2 hover:bg-lime-900/25 hover:text-white"
            >
              <Table className="h-4 w-4" />
              Insert Table
            </DropdownMenuItem>
            <DropdownMenuItem
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              disabled={!editor.can().addColumnBefore()}
              className="flex items-center gap-2 hover:bg-lime-900/25 hover:text-white"
            >
              <Columns className="h-4 w-4" />
              Add Column Before
            </DropdownMenuItem>
            <DropdownMenuItem
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              disabled={!editor.can().addColumnAfter()}
              className="flex items-center gap-2 hover:bg-lime-900/25 hover:text-white"
            >
              <Columns className="h-4 w-4" />
              Add Column After
            </DropdownMenuItem>
            <DropdownMenuItem
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().deleteColumn().run()}
              disabled={!editor.can().deleteColumn()}
              className="flex items-center gap-2 hover:bg-lime-900/25 hover:text-white"
            >
              <Columns className="h-4 w-4" />
              Delete Column
            </DropdownMenuItem>
            <DropdownMenuItem
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().addRowBefore().run()}
              disabled={!editor.can().addRowBefore()}
              className="flex items-center gap-2 hover:bg-lime-900/25 hover:text-white"
            >
              <Rows className="h-4 w-4" />
              Add Row Before
            </DropdownMenuItem>
            <DropdownMenuItem
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().addRowAfter().run()}
              disabled={!editor.can().addRowAfter()}
              className="flex items-center gap-2 hover:bg-lime-900/25 hover:text-white"
            >
              <Rows className="h-4 w-4" />
              Add Row After
            </DropdownMenuItem>
            <DropdownMenuItem
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().deleteRow().run()}
              disabled={!editor.can().deleteRow()}
              className="flex items-center gap-2 hover:bg-lime-900/25 hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
              Delete Row
            </DropdownMenuItem>
            <DropdownMenuItem
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().mergeCells().run()}
              disabled={!editor.can().mergeCells()}
              className="flex items-center gap-2 hover:bg-lime-900/25 hover:text-white"
            >
              <Merge className="h-4 w-4" />
              Merge Cells
            </DropdownMenuItem>
            <DropdownMenuItem
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().splitCell().run()}
              disabled={!editor.can().splitCell()}
              className="flex items-center gap-2 hover:bg-lime-900/25 hover:text-white"
            >
              <Split className="h-4 w-4" />
              Split Cell
            </DropdownMenuItem>
            <DropdownMenuItem
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().deleteTable().run()}
              disabled={!editor.can().deleteTable()}
              className="flex items-center gap-2 hover:bg-lime-900/25 hover:text-white"
            >
              <Table className="h-4 w-4" />
              Delete Table
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      component: (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 p-1 rounded hover:bg-lime-900/25 hover:text-white transition-colors">
            <span>{getActiveHeading()}</span>
            <ChevronDown className="h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[180px] bg-black">
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={`flex items-center gap-2 hover:bg-lime-900/25 hover:text-white ${
                editorState.isParagraph ? "bg-lime-700/20 text-white" : ""
              }`}
            >
              <Pilcrow className="h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`flex items-center gap-2 hover:bg-lime-900/25 hover:text-white ${
                editorState.isHeading1 ? "bg-lime-700/20 text-white" : ""
              }`}
            >
              <Heading1 className="h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`flex items-center gap-2 hover:bg-lime-900/25 hover:text-white ${
                editorState.isHeading2 ? "bg-lime-700/20 text-white" : ""
              }`}
            >
              <Heading2 className="h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`flex items-center gap-2 hover:bg-lime-900/25 hover:text-white ${
                editorState.isHeading3 ? "bg-lime-700/20 text-white" : ""
              }`}
            >
              <Heading3 className="h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
              className={`flex items-center gap-2 hover:bg-lime-900/25 hover:text-white ${
                editorState.isHeading4 ? "bg-lime-700/20 text-white" : ""
              }`}
            >
              <Heading4 className="h-4 w-4" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      component: (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 p-1 rounded hover:bg-lime-900/25 hover:text-white transition-colors">
            <span>{getActiveList()}</span>
            <ChevronDown className="h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[180px] bg-black">
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`flex items-center gap-2 hover:bg-lime-900/25 hover:text-white ${
                editorState.isBulletList ? "bg-lime-700/20 text-white" : ""
              }`}
            >
              <List className="h-4 w-4" />
              Bullet List
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`flex items-center gap-2 hover:bg-lime-900/25 hover:text-white ${
                editorState.isOrderedList ? "bg-lime-700/20 text-white" : ""
              }`}
            >
              <ListOrdered className="h-4 w-4" />
              Ordered List
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      icon: <Quote className="h-4 w-4" />,
      command: (editor: Editor) =>
        editor.chain().focus().toggleBlockquote().run(),
      isActive: (state: typeof editorState) => state.isBlockquote,
    },
    {
      icon: <CodeSquare className="h-4 w-4" />,
      command: (editor: Editor) =>
        editor.chain().focus().toggleCodeBlock().run(),
      isActive: (state: typeof editorState) => state.isCodeBlock,
    },
    { separator: true },
    {
      icon: <Bold className="h-4 w-4" />,
      command: (editor: Editor) => editor.chain().focus().toggleBold().run(),
      isActive: (state: typeof editorState) => state.isBold,
      isEnabled: (state: typeof editorState) => state.canBold,
    },
    {
      icon: <Italic className="h-4 w-4" />,
      command: (editor: Editor) => editor.chain().focus().toggleItalic().run(),
      isActive: (state: typeof editorState) => state.isItalic,
      isEnabled: (state: typeof editorState) => state.canItalic,
    },
    {
      icon: <Strikethrough className="h-4 w-4" />,
      command: (editor: Editor) => editor.chain().focus().toggleStrike().run(),
      isActive: (state: typeof editorState) => state.isStrike,
      isEnabled: (state: typeof editorState) => state.canStrike,
    },
    {
      icon: <Code className="h-4 w-4" />,
      command: (editor: Editor) => editor.chain().focus().toggleCode().run(),
      isActive: (state: typeof editorState) => state.isCode,
      isEnabled: (state: typeof editorState) => state.canCode,
    },
    {
      icon: <Underline className="h-4 w-4" />,
      command: (editor: Editor) =>
        editor.chain().focus().toggleUnderline().run(),
      isActive: (state: typeof editorState) => state.isUnderline,
      isEnabled: (state: typeof editorState) => state.canUnderline,
    },
    {
      icon: <Highlighter className="h-4 w-4" />,
      command: (editor: Editor) =>
        editor.chain().focus().toggleHighlight().run(),
      isActive: (state: typeof editorState) => state.isHighlight,
      isEnabled: (state: typeof editorState) => state.canHighlight,
    },
    {
      component: (
        <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <Toggle
              ref={linkButtonRef}
              size="sm"
              pressed={editorState.isLink}
              disabled={!editorState.canLink}
              onPressedChange={handleLinkToggle}
              className="hover:bg-lime-900/20 hover:text-white data-[state=on]:bg-lime-700/25 data-[state=on]:text-white"
            >
              <Link className="h-4 w-4" />
            </Toggle>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 bg-black border border-neutral-800 p-2"
            align="start"
            sideOffset={5}
          >
            <form onSubmit={handleLinkSubmit} className="flex flex-col gap-2">
              <Input
                ref={linkInputRef}
                type="url"
                placeholder="Enter URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="bg-black border border-neutral-800 text-white"
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLinkPopoverOpen(false)}
                  className="text-white hover:bg-neutral-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-lime-700 hover:bg-lime-800 text-white"
                >
                  Apply
                </Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      ),
    },
    { separator: true },
    {
      icon: <Superscript className="h-4 w-4" />,
      command: (editor: Editor) =>
        editor.chain().focus().toggleSuperscript().run(),
      isActive: (state: typeof editorState) => state.isSuperscript,
    },
    {
      icon: <Subscript className="h-4 w-4" />,
      command: (editor: Editor) =>
        editor.chain().focus().toggleSubscript().run(),
      isActive: (state: typeof editorState) => state.isSubscript,
    },
    { separator: true },
    {
      icon: <AlignLeft className="h-4 w-4" />,
      command: (editor: Editor) =>
        editor.chain().focus().setTextAlign("left").run(),
      isActive: (state: typeof editorState) => state.isLeftAlign,
    },
    {
      icon: <AlignCenter className="h-4 w-4" />,
      command: (editor: Editor) =>
        editor.chain().focus().setTextAlign("center").run(),
      isActive: (state: typeof editorState) => state.isCenterAlign,
    },
    {
      icon: <AlignRight className="h-4 w-4" />,
      command: (editor: Editor) =>
        editor.chain().focus().setTextAlign("right").run(),
      isActive: (state: typeof editorState) => state.isRightAlign,
    },
  ];

  return (
    <div className="sticky top-[120px] z-10 bg-black border-b border-neutral-800 bg-neutral-800 rounded-md border-neutral-500">
      <div className="flex items-center gap-1 p-1">
        {MENU_OPTIONS.map((opt, idx) => {
          if ("separator" in opt && opt.separator) {
            return (
              <div
                key={`sep-${idx}`}
                className="h-6 w-px bg-neutral-800 mx-1"
                aria-hidden="true"
              />
            );
          }
          if ("component" in opt) {
            return <React.Fragment key={idx}>{opt.component}</React.Fragment>;
          }
          return (
            <Toggle
              key={idx}
              size="sm"
              pressed={opt.isActive?.(editorState) ?? false}
              disabled={opt.isEnabled ? !opt.isEnabled(editorState) : false}
              onPressedChange={() => opt.command && opt.command(editor)}
              className="hover:bg-lime-900/20 hover:text-white data-[state=on]:bg-lime-700/25 data-[state=on]:text-white"
            >
              {opt.icon}
            </Toggle>
          );
        })}
      </div>
    </div>
  );
}

export default EditorMenu;
