"use client";
import { useState } from "react";
import { Copy, FlaskConical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";

interface CompetitiveAnalysisResponse {
  uniqueValueProposition: string[];
  competitiveAdvantages: string[];
  targetAudienceAlignment: string;
  recommendedPositioning: string;
}
import { toast } from "sonner";
import { useSession } from "next-auth/react"

function CompetitiveAngleForm({
  projectDescription,
  setProjectDescription,
  competitors,
  setCompetitors,
  targetAudience,
  setTargetAudience
}: {
  projectDescription: string;
  setProjectDescription: (value: string) => void;
  competitors: string;
  setCompetitors: (value: string) => void;
  targetAudience: string;
  setTargetAudience: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-300">Project Description</Label>
        <Textarea
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
          placeholder="Describe your project in 1-2 sentences"
          rows={3}
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Competitors</Label>
        <Textarea
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
          placeholder="List similar projects/products (optional)"
          rows={2}
          value={competitors}
          onChange={(e) => setCompetitors(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Target Audience</Label>
        <Input
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
          placeholder="e.g., developers, designers, startups"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
        />
      </div>
    </div>
  );
}

export default function CompetitiveAngleModal({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CompetitiveAnalysisResponse | null>(null);
  const [projectDescription, setProjectDescription] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const { data: session } = useSession();

  const handleRun = async () => {
    if (!projectDescription.trim()) {
      toast.warning("Please provide a project description");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai-toolkit/competitive-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userid': session?.user?.id!,
          'sb-access-token': session?.supabaseAccessToken!
        },
        body: JSON.stringify({
          projectDescription,
          competitors,
          targetAudience
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === 'insufficient_credits') {
          toast.error("You've run out of AI credits. Please upgrade your plan or wait until your credits refresh on the next billing cycle.", { duration: 15000});
        } else {
          throw new Error(errorData.error || `API error: ${response.status}`);
        }
        return;
      }
      
      const data: CompetitiveAnalysisResponse = await response.json();
      setAnalysisResult(data);
      setAnalysisComplete(true);
    } catch (error) {
      console.error('Error generating competitive analysis:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisComplete(false);
    setAnalysisResult(null);
    setProjectDescription("");
    setCompetitors("");
    setTargetAudience("");
  };

  const copyToClipboard = async () => {
    if (!analysisResult) return;
    
    const text = `Unique Value Proposition:
${analysisResult.uniqueValueProposition.map(item => `• ${item}`).join('\n')}

Competitive Advantages:
${analysisResult.competitiveAdvantages.map(item => `• ${item}`).join('\n')}

Target Audience Alignment:
${analysisResult.targetAudienceAlignment}

Recommended Positioning:
${analysisResult.recommendedPositioning}`;

    try {
      await navigator.clipboard.writeText(text);
      toast.success('Analysis copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleCloseRequest = () => {
    if (analysisComplete) {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  };

  return (
    <>
      <Dialog open onOpenChange={(open) => !open && handleCloseRequest()}>
        <DialogContent className={`${analysisComplete ? 'max-w-5xl' : 'max-w-4xl'} bg-gray-950 border border-purple-500/30 rounded-2xl font-prompt overflow-hidden backdrop-blur-sm shadow-2xl shadow-purple-500/20 max-h-[90vh]`}>
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

          <div className="relative z-10 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {!analysisComplete ? (
              <div className="space-y-6">
                <CompetitiveAngleForm
                  projectDescription={projectDescription}
                  setProjectDescription={setProjectDescription}
                  competitors={competitors}
                  setCompetitors={setCompetitors}
                  targetAudience={targetAudience}
                  setTargetAudience={setTargetAudience}
                />
                
                <div className="flex justify-between items-center pt-4 border-t border-purple-500/20">
                  <div className="text-sm text-gray-400">
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-gray-600 transition-all px-6 hover:text-white text-gray-300"
                      onClick={handleCloseRequest}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white transition-all px-8 shadow-lg hover:shadow-purple-500/40 disabled:opacity-70"
                      disabled={isLoading || !projectDescription.trim()}
                      onClick={handleRun}
                    >
                      {isLoading ? "Processing..." : "Generate Analysis"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="sticky top-0 z-20 bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-3 flex items-center gap-2 text-yellow-300 text-sm mb-4 backdrop-blur-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Copy response before you close this modal. It will not be saved.</span>
                </div>
                <div className="bg-gray-900/60 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm shadow-inner shadow-purple-900/30 transition-all pr-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-300">Competitive Analysis</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-gray-600 transition-all hover:text-white text-gray-300"
                      onClick={copyToClipboard}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  
                  {analysisResult && (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <h3 className="text-purple-400 drop-shadow-[0_0_3px_rgba(192,132,252,0.4)]">Unique Value Proposition</h3>
                      <ul className="space-y-2 text-gray-300">
                        {analysisResult.uniqueValueProposition.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                      
                      <h3 className="text-purple-400 drop-shadow-[0_0_3px_rgba(192,132,252,0.4)] mt-4">Competitive Advantages</h3>
                      <ul className="space-y-2 text-gray-300">
                        {analysisResult.competitiveAdvantages.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                      
                      <h3 className="text-purple-400 drop-shadow-[0_0_3px_rgba(192,132,252,0.4)] mt-4">Target Audience Alignment</h3>
                      <p className="text-gray-300">
                        {analysisResult.targetAudienceAlignment}
                      </p>
                      
                      <h3 className="text-purple-400 drop-shadow-[0_0_3px_rgba(192,132,252,0.4)] mt-4">Recommended Positioning</h3>
                      <p className="text-gray-300">
                        {analysisResult.recommendedPositioning}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 pt-4 border-t border-purple-500/20">
                  <Button
                    variant="outline"
                    className="border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-gray-600 transition-all px-6 hover:text-white text-gray-300"
                    onClick={handleReset}
                  >
                    New Analysis
                  </Button>
                  <Button
                    className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white transition-all px-8 shadow-lg hover:shadow-purple-500/40"
                    onClick={handleCloseRequest}
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showCloseConfirm} onOpenChange={setShowCloseConfirm}>
        <DialogContent className="bg-gray-950 border border-yellow-500/30 rounded-2xl font-prompt backdrop-blur-sm shadow-2xl shadow-yellow-500/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-orange-400 flex items-center gap-2">
              <X className="w-5 h-5" />
              Close modal
            </DialogTitle>
            <DialogDescription className="text-gray-300 mt-2">
              Your analysis will not be saved. Are you sure you want to close?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              variant="outline"
              className="border-gray-700 bg-gray-900 hover:bg-gray-800 text-gray-300"
              onClick={() => setShowCloseConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => {
                setShowCloseConfirm(false);
                onClose();
              }}
            >
              Close anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}