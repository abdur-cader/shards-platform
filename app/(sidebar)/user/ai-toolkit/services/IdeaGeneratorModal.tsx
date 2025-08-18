// app/(sidebar)/user/ai-toolkit/services/IdeaGeneratorModal.tsx
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
import IdeaGeneratorForm from "./IdeaGeneratorForm";
import { Brain } from "lucide-react";

export default function IdeaGeneratorModal({ onClose }: { onClose: () => void }) {
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
      <DialogContent className="max-w-4xl bg-gray-800/95 border-gray-700 rounded-xl font-prompt overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/5 to-blue-500/5 opacity-30 pointer-events-none"></div>
        <DialogHeader className="relative z-10 border-b border-gray-700 pb-4">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-400/10">
              <Brain className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">
              Idea Generator
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3 text-gray-300">Input</h3>
              <IdeaGeneratorForm />
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
                  <h3 className="text-indigo-400">Generated Ideas</h3>
                  <ol className="space-y-3">
                    <li>AI-powered code review assistant</li>
                    <li>Automated documentation generator</li>
                    <li>Smart commit message writer</li>
                    <li>Personalized learning path creator</li>
                    <li>Code smell detector with explanations</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}