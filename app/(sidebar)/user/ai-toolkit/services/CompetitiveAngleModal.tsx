"use client";
import { useState } from "react";
import { Copy, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function CompetitiveAngleForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-300">Project Description</Label>
        <Textarea
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
          placeholder="Describe your project in 1-2 sentences"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Competitors</Label>
        <Textarea
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
          placeholder="List similar projects/products (optional)"
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Target Audience</Label>
        <Input
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
          placeholder="e.g., developers, designers, startups"
        />
      </div>
    </div>
  );
}

export default function CompetitiveAngleModal({ onClose }: { onClose: () => void }) {
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
      <DialogContent className="max-w-4xl bg-gray-950 border border-purple-500/30 rounded-2xl font-prompt overflow-hidden backdrop-blur-sm shadow-2xl shadow-purple-500/20">
        {/* Background elements - matching other modals */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/15 to-gray-950/80 opacity-30 pointer-events-none"></div>
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl animate-float-slow"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl animate-float-slow animation-delay-2000"></div>
          <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-purple-400/8 rounded-full filter blur-xl animate-float"></div>
        </div>

        <DialogHeader className="relative z-10 border-b border-purple-500/20 pb-4">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
              <FlaskConical className="w-6 h-6 text-white drop-shadow-[0_0_5px_rgba(192,132,252,0.7)]" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-purple-400 font-semibold text-xl tracking-tight drop-shadow-[0_0_5px_rgba(192,132,252,0.4)]">
              Competitive Angle
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 py-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3 text-gray-300">Input</h3>
              <CompetitiveAngleForm />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-purple-500/20">
              <div className="text-sm text-gray-400">
                <span className="text-purple-400 font-semibold drop-shadow-[0_0_3px_rgba(192,132,252,0.4)]">1 credit</span> will be used
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-gray-600 transition-all px-6 hover:text-white text-gray-300"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white transition-all px-8 shadow-lg hover:shadow-purple-500/40 disabled:opacity-70"
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
                  className="border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-gray-600 transition-all hover:text-white text-gray-300"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="bg-gray-900/60 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm shadow-inner shadow-purple-900/30 h-64 overflow-auto transition-all">
                <div className="prose prose-invert prose-sm max-w-none">
                  <h3 className="text-purple-400 drop-shadow-[0_0_3px_rgba(192,132,252,0.4)]">Unique Value Proposition</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>Focuses specifically on developer experience</li>
                    <li>Open-source alternative to commercial tools</li>
                    <li>Seamless GitHub integration</li>
                    <li>Privacy-focused data handling</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}