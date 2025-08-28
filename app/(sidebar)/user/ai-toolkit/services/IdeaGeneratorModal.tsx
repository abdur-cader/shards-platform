"use client";
import { useState, useRef, useEffect } from "react";
import { Copy, Brain, X, Save, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// Zod schema for validation
const ideaGeneratorSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 20 characters long"),
  skills: z.string().min(5, "Skills must be at least 20 characters long"),
  complexity: z.enum(["beginner", "intermediate", "advanced", "any"])
});

type IdeaGeneratorFormData = z.infer<typeof ideaGeneratorSchema>;

// Define the idea type
interface Idea {
  id: number;
  title: string;
  description: string;
  estimatedTime: string;
}

export default function IdeaGeneratorModal({ onClose }: { onClose: () => void }) {
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof IdeaGeneratorFormData, string>>>({});
  const [formData, setFormData] = useState<IdeaGeneratorFormData>({
    topic: "",
    skills: "",
    complexity: "any"
  });
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedIdeaIds, setSavedIdeaIds] = useState<Set<number>>(new Set());
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle width transition when ideas are loaded
  useEffect(() => {
    if (ideas.length > 0) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [ideas]);

  const handleInputChange = (field: keyof IdeaGeneratorFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate form data
      const validationResult = ideaGeneratorSchema.safeParse(formData);
      
      if (!validationResult.success) {
        const fieldErrors: Record<string, string> = {};
        validationResult.error.errors.forEach(error => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
        setIsLoading(false);
        return;
      }

      // Clear any previous errors
      setErrors({});

      // Send data to API
      const response = await fetch('/api/ai-toolkit/idea-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userid': session?.user?.id!,
          'sb-access-token': session?.supabaseAccessToken!
        },
        body: JSON.stringify(validationResult.data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === 'insufficient_credits') {
          toast.error("You've run out of AI credits. Please upgrade your plan or wait until your credits refresh on the next billing cycle.", { duration: 15000});
        } else {
          throw new Error('Failed to generate ideas');
        }
        setIsLoading(false);
        return;
      }

      const result = await response.json();
      setIdeas(result.ideas);
      setCurrentIdeaIndex(0);
      setSavedIdeaIds(new Set()); // Reset saved IDs when new ideas are generated
      
    } catch (error) {
      console.error('Error generating ideas:', error);
      toast.error("Failed to generate ideas. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (ideas.length === 0) return;
    
    setIsSaving(true);
    try {
      const currentIdea = ideas[currentIdeaIndex];
      
      const response = await fetch('/api/ai-toolkit/idea-generator/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userid': session?.user?.id!,
          'sb-access-token': session?.supabaseAccessToken!
        },
        body: JSON.stringify(currentIdea),
      });

      if (!response.ok) {
        throw new Error('Failed to save idea');
      }

      const result = await response.json();
      
      // Add the saved idea ID to the set
      setSavedIdeaIds(prev => new Set(prev).add(currentIdea.id));
      toast.success("Idea saved successfully!");
    } catch (error) {
      console.error('Error saving idea:', error);
      toast.error("Failed to save idea. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrevious = () => {
    if (currentIdeaIndex > 0) {
      setCurrentIdeaIndex(currentIdeaIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIdeaIndex < ideas.length - 1) {
      setCurrentIdeaIndex(currentIdeaIndex + 1);
    }
  };

  const handleCopy = () => {
    if (ideas.length === 0) return;
    
    const ideaText = `Idea: ${ideas[currentIdeaIndex].title}\nDescription: ${ideas[currentIdeaIndex].description}\nEstimated Completion: ${ideas[currentIdeaIndex].estimatedTime}`;
    navigator.clipboard.writeText(ideaText);
    toast.success("Idea copied to clipboard!");
  };

  const handleReset = () => {
    setIdeas([]);
    setCurrentIdeaIndex(0);
    setSavedIdeaIds(new Set());
  };

  const handleCloseAttempt = () => {
    // Check if there are unsaved ideas (ideas generated but not all saved)
    const hasUnsavedIdeas = ideas.length > 0 && savedIdeaIds.size < ideas.length;
    
    if (hasUnsavedIdeas) {
      setShowCloseConfirmation(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = (): void => {
    setShowCloseConfirmation(false);
    onClose();
  };

  const handleCancelClose = () => {
    setShowCloseConfirmation(false);
  };

  const isLastIdea = currentIdeaIndex === ideas.length - 1;
  const currentIdea = ideas[currentIdeaIndex];
  const isIdeaSaved = currentIdea && savedIdeaIds.has(currentIdea.id);

  return (
    <>
      <Dialog open onOpenChange={(open) => !open && handleCloseAttempt()}>
        <DialogContent 
          ref={dialogRef}
          className={`bg-gray-950 border border-purple-500/30 rounded-2xl font-prompt overflow-hidden backdrop-blur-sm shadow-2xl shadow-purple-500/20 transition-all duration-500 ${
            isExpanded ? "max-w-4xl" : "max-w-3xl"
          }`}
        >
          {/* Background elements - matching ReadmeBuilderModal */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/15 to-gray-950/80 opacity-30 pointer-events-none"></div>
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl animate-float-slow"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl animate-float-slow animation-delay-2000"></div>
            <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-purple-400/8 rounded-full filter blur-xl animate-float"></div>
          </div>

          <DialogHeader className="relative z-10 border-b border-purple-500/20 pb-4 transition-colors duration-300">
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
                <Brain className="w-6 h-6 text-white drop-shadow-[0_0_5px_rgba(192,132,252,0.7)]" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-purple-400 font-semibold text-xl tracking-tight drop-shadow-[0_0_5px_rgba(192,132,252,0.4)]">
                Idea Generator
              </span>
            </DialogTitle>
          </DialogHeader>

          {ideas.length === 0 ? (
            <form onSubmit={handleSubmit}>
              <div className="relative z-10 py-4 transition-all duration-300">
                <div className="space-y-6">
                  <div>
                    <div className="space-y-4 transition-all duration-300">
                      <div className="space-y-2 transition-all duration-300">
                        <Label className="text-gray-300 transition-colors duration-300">Topic or Interest</Label>
                        <Input
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                          placeholder="e.g., AI tools for developers, machine learning applications, etc."
                          value={formData.topic}
                          onChange={(e) => handleInputChange('topic', e.target.value)}
                        />
                        {errors.topic && (
                          <p className="text-red-400 text-sm mt-1">{errors.topic}</p>
                        )}
                      </div>
                      <div className="space-y-2 transition-all duration-300">
                        <Label className="text-gray-300 transition-colors duration-300">Your Skills</Label>
                        <Input
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                          placeholder="e.g., React, Python, Machine Learning, JavaScript, etc."
                          value={formData.skills}
                          onChange={(e) => handleInputChange('skills', e.target.value)}
                        />
                        {errors.skills && (
                          <p className="text-red-400 text-sm mt-1">{errors.skills}</p>
                        )}
                      </div>
                      <div className="space-y-2 transition-all duration-300">
                        <Label className="text-gray-300 transition-colors duration-300">Project Complexity</Label>
                      <Select 
                        value={formData.complexity}
                        onValueChange={(value) => handleInputChange('complexity', value)}
                      >
                        <SelectTrigger className="flex h-10 w-full rounded-md border border-purple-800 bg-purple-950/80 px-3 py-2 text-sm text-purple-200 placeholder:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-purple-600 transition-all">
                          <SelectValue placeholder="Select complexity level" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border border-purple-800 text-purple-200">
                          <SelectItem 
                            value="beginner" 
                            className="focus:bg-purple-800/50 focus:text-purple-100 data-[state=checked]:bg-purple-800 data-[state=checked]:text-purple-100 data-[state=checked]:shadow-[0_0_10px_rgba(168,85,247,0.6)]"
                          >
                            Beginner (1-2 weeks)
                          </SelectItem>
                          <SelectItem 
                            value="intermediate" 
                            className="focus:bg-purple-800/50 focus:text-purple-100 data-[state=checked]:bg-purple-800 data-[state=checked]:text-purple-100 data-[state=checked]:shadow-[0_0_10px_rgba(168,85,247,0.6)]"
                          >
                            Intermediate (1-3 months)
                          </SelectItem>
                          <SelectItem 
                            value="advanced" 
                            className="focus:bg-purple-800/50 focus:text-purple-100 data-[state=checked]:bg-purple-800 data-[state=checked]:text-purple-100 data-[state=checked]:shadow-[0_0_10px_rgba(168,85,247,0.6)]"
                          >
                            Advanced (3-6 months)
                          </SelectItem>
                          <SelectItem 
                            value="any" 
                            className="focus:bg-purple-800/50 focus:text-purple-100 data-[state=checked]:bg-purple-800 data-[state=checked]:text-purple-100 data-[state=checked]:shadow-[0_0_10px_rgba(168,85,247,0.6)]"
                          >
                            Any
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-purple-500/20 transition-all duration-300">
                    <div className="text-sm text-gray-400 transition-colors duration-300">
                    </div>
                    <div className="flex gap-2 transition-all duration-300">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-gray-600 transition-all px-6 hover:text-white text-gray-300"
                        onClick={handleCloseAttempt}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white transition-all px-8 shadow-lg hover:shadow-purple-500/40 disabled:opacity-70"
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Generate Ideas"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="relative z-10 py-4 transition-all duration-300">
              <div className="space-y-6">
                <div className="bg-gray-900/60 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm shadow-inner shadow-purple-900/30 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-white break-words">
                      {ideas[currentIdeaIndex].title}
                    </h3>
                    <div className="text-sm text-purple-400 bg-purple-400/10 px-2 py-1 rounded drop-shadow-[0_0_3px_rgba(192,132,252,0.3)]">
                      {ideas[currentIdeaIndex].estimatedTime}
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6 break-words whitespace-pre-line">
                    {ideas[currentIdeaIndex].description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      Idea {currentIdeaIndex + 1} of {ideas.length}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-gray-600 transition-all hover:text-white text-gray-300"
                        onClick={handleCopy}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white transition-all shadow-lg hover:shadow-purple-500/40 disabled:opacity-70"
                        onClick={handleSave}
                        disabled={isSaving || isIdeaSaved}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isIdeaSaved ? "Saved" : isSaving ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-gray-600 transition-all hover:text-white text-gray-300"
                    onClick={handlePrevious}
                    disabled={currentIdeaIndex === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-gray-600 transition-all hover:text-white text-gray-300"
                    onClick={handleCloseAttempt}
                    >
                    <X className="w-4 h-4 mr-2" />
                    Close
                  </Button>

                  {isLastIdea && (
                    <Button
                      variant="outline"
                      className="border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-gray-600 transition-all hover:text-white text-gray-300"
                      onClick={handleReset}
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      New Ideas
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    className="border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-gray-600 transition-all hover:text-white text-gray-300"
                    onClick={handleNext}
                    disabled={currentIdeaIndex === ideas.length - 1}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showCloseConfirmation} onOpenChange={setShowCloseConfirmation}>
        <DialogContent className="bg-gray-950 border border-red-500/30 rounded-2xl font-prompt backdrop-blur-sm shadow-2xl shadow-red-500/20">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center gap-2">
              <X className="w-5 h-5" />
              Confirm Close
            </DialogTitle>
            <DialogDescription className="text-gray-300 mt-2">
              Any unsaved ideas will be lost. Are you sure you want to close?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              variant="outline"
              className="border-gray-700 bg-gray-900 hover:bg-gray-800 text-gray-300"
              onClick={handleCancelClose}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleConfirmClose}
            >
              Yes, Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}