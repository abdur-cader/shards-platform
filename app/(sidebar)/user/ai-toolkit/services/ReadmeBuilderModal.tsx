// app/(sidebar)/user/ai-toolkit/services/ReadmeBuilderModal.tsx
"use client";
import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReadmeBuilderForm from "./ReadmeBuilderForm";
import { FileText } from "lucide-react";

export default function ReadmeBuilderModal({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Tool execution to be implemented");
    }, 1500);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="min-w-6xl bg-gray-800/95 border-gray-700 rounded-xl font-prompt overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/5 to-blue-500/5 opacity-30 pointer-events-none"></div>
        <DialogHeader className="relative z-10 border-b border-gray-700 pb-4">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-400/10">
              <FileText className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">
              README Builder
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3 text-gray-300">Input</h3>
              <ReadmeBuilderForm />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                This will use 1 credit
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-gray-600 hover:bg-gray-700 hover:border-gray-500 transition-all"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-indigo-500 hover:bg-indigo-400 text-white transition-all"
                  disabled={isLoading}
                  onClick={handleRun}
                >
                  {isLoading ? "Processing..." : "Run Tool"}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-300">Output</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 hover:bg-gray-700 hover:border-gray-500 transition-all"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-4 h-64 overflow-auto transition-all">
                <div className="prose prose-invert prose-sm max-w-none">
                  <h1 className="text-2xl font-bold">Project Name</h1>
                  <p>A brief description of what your project does.</p>
                  <h2 className="text-xl font-semibold mt-4">Features</h2>
                  <ul>
                    <li>Feature one description</li>
                    <li>Feature two description</li>
                    <li>Feature three description</li>
                  </ul>
                  <h2 className="text-xl font-semibold mt-4">Installation</h2>
                  <pre className="bg-gray-800 p-3 rounded"><code>npm install</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}