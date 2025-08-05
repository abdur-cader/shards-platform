"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export function CopyButton({ text }: { text: string }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-zinc-400 hover:text-lime-400 p-1 h-6 w-6"
      onClick={copyToClipboard}
    >
      <Copy className="w-3 h-3" />
    </Button>
  );
}
