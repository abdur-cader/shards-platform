"use client";
import { useState, useEffect } from "react";
import { Copy, Code, ArrowLeft, Save, X, Check } from "lucide-react"; // Added Check icon
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner";

function StackRecommenderForm({ 
  formData, 
  setFormData 
}: { 
  formData: any;
  setFormData: (data: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-300">Project Type</Label>
        <Input
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
          placeholder="e.g., SaaS, mobile app"
          value={formData.projectType}
          onChange={(e) => setFormData({...formData, projectType: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Key Requirements</Label>
        <Textarea
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
          placeholder="e.g., real-time updates, user auth"
          rows={3}
          value={formData.requirements}
          onChange={(e) => setFormData({...formData, requirements: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Your Preferences</Label>
        <Input
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
          placeholder="e.g., prefer JavaScript"
          value={formData.preferences}
          onChange={(e) => setFormData({...formData, preferences: e.target.value})}
        />
      </div>
    </div>
  );
}

export default function StackRecommenderModal({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Added saving state
  const [isSaved, setIsSaved] = useState(false); // Added saved state
  const [formData, setFormData] = useState({
    projectType: '',
    requirements: '',
    preferences: ''
  });
  const { data: session } = useSession();

  useEffect(() => {
    // Reset state when modal opens
    return () => {
      setRecommendation(null);
      setIsLoading(false);
    };
  }, []);

  const handleRun = async () => {
    if (!formData.projectType || !formData.requirements) {
      toast.warning("Please fill in project type and requirements")
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai-toolkit/stack-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate stack recommendation');
      }
      
      const data = await response.json();
      setRecommendation(JSON.stringify(data, null, 2));
      setHasUnsavedChanges(true);
      setIsSaved(false); // Reset saved state when new recommendation is generated
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate stack recommendation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!recommendation || isSaved) return;
    
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/ai-toolkit/stack-generator/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'sb-access-token': session?.supabaseAccessToken!,
          'user-id': session?.user?.id!
        },
        body: JSON.stringify({
          object: JSON.parse(recommendation),
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save stack recommendation');
      }
      
      const data = await response.json();
      toast.success('Stack recommendation saved successfully!');
      setHasUnsavedChanges(false);
      setIsSaved(true); // Mark as saved
    } catch (error) {
      console.error('Error saving recommendation:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save stack recommendation');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    if (recommendation) {
      navigator.clipboard.writeText(recommendation);
    }
  };

  const handleCloseRequest = () => {
    if (hasUnsavedChanges) {
      setShowCloseConfirm(true);
    } else {
      handleCloseDirectly();
    }
  };

  const handleCloseDirectly = () => {
    setIsOpen(false);
    setTimeout(() => onClose(), 100);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCloseRequest();
    } else {
      setIsOpen(true);
    }
  };

  const confirmClose = () => {
    setShowCloseConfirm(false);
    setTimeout(() => {
      handleCloseDirectly();
    }, 200);
  };

  const cancelClose = () => {
    setShowCloseConfirm(false);
    setIsOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-5xl bg-gray-950 border border-purple-500/30 rounded-2xl font-prompt overflow-hidden backdrop-blur-sm shadow-2xl shadow-purple-500/20">
          {/* Background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/15 to-gray-950/80 opacity-30 pointer-events-none"></div>
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl animate-float-slow"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl animate-float-slow animation-delay-2000"></div>
            <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-purple-400/8 rounded-full filter blur-xl animate-float"></div>
          </div>

          <DialogHeader className="relative z-10 border-b border-purple-500/20 pb-4">
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
                <Code className="w-6 h-6 text-white drop-shadow-[0_0_5px_rgba(192,132,252,0.7)]" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-purple-400 font-semibold text-xl tracking-tight drop-shadow-[0_0_5px_rgba(192,132,252,0.4)]">
                Stack Recommender
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="relative z-10 grid grid-cols-1 gap-6 py-6">
            {!recommendation ? (
              <div className="space-y-6">
                <StackRecommenderForm formData={formData} setFormData={setFormData} />

                <div className="flex justify-between items-center pt-4 border-t border-purple-500/20">
                  <div className="text-sm text-gray-400">
                    <span className="text-purple-400 font-semibold drop-shadow-[0_0_3px_rgba(192,132,252,0.4)]">1 credit</span> will be used
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
                      disabled={isLoading}
                      onClick={handleRun}
                    >
                      {isLoading ? "Processing..." : "Run Tool"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-300">Recommended Stack</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-gray-600 transition-all hover:text-white text-gray-300"
                      onClick={handleCopy}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-gray-900/60 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm shadow-inner shadow-purple-900/30 max-h-96 overflow-auto transition-all">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                      {recommendation}
                    </pre>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-purple-500/20">
                  <div className="text-sm text-gray-400">
                    Stack recommendation generated
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-gray-600 transition-all px-6 hover:text-white text-gray-300"
                      onClick={handleCloseRequest}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Close
                    </Button>
                    <Button
                      className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white transition-all px-8 shadow-lg hover:shadow-purple-500/40 disabled:opacity-70"
                      onClick={handleSave}
                      disabled={isSaving || isSaved} // Disable when saving or already saved
                    >
                      {isSaving ? (
                        <>
                          <span className="animate-pulse">Saving...</span>
                        </>
                      ) : isSaved ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Close Confirmation Dialog */}
      <AlertDialog open={showCloseConfirm} onOpenChange={setShowCloseConfirm}>
        <AlertDialogContent className="bg-gray-950 border border-purple-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-300">Close Stack Recommender?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Any unsaved changes will be lost and used credits will not be restored. Are you sure you want to close?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="border-gray-700 bg-gray-900 hover:bg-gray-800 text-gray-300"
              onClick={cancelClose}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={confirmClose}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}