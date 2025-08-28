"use client";
import { useState, useEffect } from "react";
import { Copy, Code, ArrowLeft, Save, X, Check } from "lucide-react";
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

function RecommendationDisplay({ recommendation }: { recommendation: any }) {
  if (!recommendation) return null;

  // Helper function to check if a value should be treated as an object
  const isObject = (value: any) => {
    return value && typeof value === 'object' && !Array.isArray(value);
  };

  // Helper function to check if a value is a simple string
  const isSimpleString = (value: any) => {
    return typeof value === 'string' && !value.includes('{') && !value.includes('[');
  };

  return (
    <div className="space-y-6">
      {/* Frontend Section */}
      {recommendation.frontend && (
        <div className="bg-gray-900/60 border border-purple-500/20 rounded-xl p-5 backdrop-blur-sm shadow-inner shadow-purple-900/30">
          <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
            <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
            Frontend
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isObject(recommendation.frontend) ? (
              Object.entries(recommendation.frontend).map(([key, value]) => (
                <div key={key} className="bg-gray-800/40 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                  <p className="text-white font-medium mt-1">{String(value)}</p>
                </div>
              ))
            ) : (
              <div className="bg-gray-800/40 p-3 rounded-lg col-span-full">
                <p className="text-white font-medium">{String(recommendation.frontend)}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backend Section */}
      {recommendation.backend && (
        <div className="bg-gray-900/60 border border-purple-500/20 rounded-xl p-5 backdrop-blur-sm shadow-inner shadow-purple-900/30">
          <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
            <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
            Backend
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isObject(recommendation.backend) ? (
              Object.entries(recommendation.backend).map(([key, value]) => (
                <div key={key} className="bg-gray-800/40 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                  <p className="text-white font-medium mt-1">{String(value)}</p>
                </div>
              ))
            ) : (
              <div className="bg-gray-800/40 p-3 rounded-lg col-span-full">
                <p className="text-white font-medium">{String(recommendation.backend)}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Database Section */}
      {recommendation.database && (
        <div className="bg-gray-900/60 border border-purple-500/20 rounded-xl p-5 backdrop-blur-sm shadow-inner shadow-purple-900/30">
          <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
            <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
            Database
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isObject(recommendation.database) ? (
              Object.entries(recommendation.database).map(([key, value]) => (
                <div key={key} className="bg-gray-800/40 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                  <p className="text-white font-medium mt-1">{String(value)}</p>
                </div>
              ))
            ) : (
              <div className="bg-gray-800/40 p-3 rounded-lg col-span-full">
                <p className="text-white font-medium">{String(recommendation.database)}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Additional Sections */}
      {Object.entries(recommendation)
      .filter(([key]) => !['frontend', 'backend', 'database'].includes(key))
      .map(([section, data]) => {
        // Check if data is an object (but not null or array)
        const isDataObject = typeof data === 'object' && data !== null && !Array.isArray(data);
        
        return (
          <div key={section} className="bg-gray-900/60 border border-purple-500/20 rounded-xl p-5 backdrop-blur-sm shadow-inner shadow-purple-900/30">
            <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
              <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </h3>
            {isDataObject ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(data).map(([key, value]) => (
                  <div key={key} className="bg-gray-800/40 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                    <p className="text-white font-medium mt-1">{String(value)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800/40 p-3 rounded-lg">
                <p className="text-white font-medium">{String(data)}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function StackRecommenderModal({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [rawRecommendation, setRawRecommendation] = useState<string | null>(null);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
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
      setRawRecommendation(null);
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
          'userid': session?.user?.id!,
          'sb-access-token': session?.supabaseAccessToken!
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === 'insufficient_credits') {
          toast.error("You've run out of AI credits. Please upgrade your plan or wait until your credits refresh on the next billing cycle.", { duration: 15000});
        } else {
          throw new Error(errorData.error || 'Failed to generate stack recommendation');
        }
        return;
      }
      
      const data = await response.json();
      setRecommendation(data);
      setRawRecommendation(JSON.stringify(data, null, 2));
      setHasUnsavedChanges(true);
      setIsSaved(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate stack recommendation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!rawRecommendation || isSaved) return;
    
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
          object: JSON.parse(rawRecommendation),
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save stack recommendation');
      }
      
      const data = await response.json();
      toast.success('Stack recommendation saved successfully!');
      setHasUnsavedChanges(false);
      setIsSaved(true);
    } catch (error) {
      console.error('Error saving recommendation:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save stack recommendation');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    if (rawRecommendation) {
      navigator.clipboard.writeText(rawRecommendation);
      toast.success("Copied to clipboard!");
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
        <DialogContent className="max-w-6xl min-w-2xl  p-5 bg-gray-950 border border-purple-500/30 rounded-2xl font-prompt overflow-hidden backdrop-blur-sm shadow-2xl shadow-purple-500/20">
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
                      Copy JSON
                    </Button>
                  </div>
                  
                  <div className="max-h-[50vh] overflow-y-auto">
                    <RecommendationDisplay recommendation={recommendation} />
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
                      disabled={isSaving || isSaved}
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
        <AlertDialogContent className="bg-gray-950 border border-red-500/30 rounded-2xl font-prompt backdrop-blur-sm shadow-2xl shadow-red-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400 flex items-center gap-2">
              <X className="w-5 h-5" />
              Close Stack Recommender?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300 mt-2">
              Any unsaved changes will be lost. Are you sure you want to close?
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
              className="bg-red-600 hover:bg-red-700 text-white"
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