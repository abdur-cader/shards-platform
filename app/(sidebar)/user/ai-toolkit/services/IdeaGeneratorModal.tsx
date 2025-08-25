"use client";
import { useState, useRef, useEffect } from "react";
import { Copy, Brain, X, Save, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";

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
        },
        body: JSON.stringify(validationResult.data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate ideas');
      }

      const result = await response.json();
      setIdeas(result.ideas);
      setCurrentIdeaIndex(0);
      
    } catch (error) {
      console.error('Error generating ideas:', error);
      alert("Failed to generate ideas. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (ideas.length === 0) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/ai-toolkit/idea-generator/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ideas[currentIdeaIndex]),
      });

      if (!response.ok) {
        throw new Error('Failed to save idea');
      }

      const result = await response.json();
      alert("Idea saved successfully!");
    } catch (error) {
      console.error('Error saving idea:', error);
      alert("Failed to save idea. Please try again.");
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
    alert("Idea copied to clipboard!");
  };

  const handleReset = () => {
    setIdeas([]);
    setCurrentIdeaIndex(0);
  };

  const isLastIdea = currentIdeaIndex === ideas.length - 1;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        ref={dialogRef}
        className={`bg-gray-800/95 border-gray-700 rounded-xl font-prompt overflow-hidden backdrop-blur-sm transition-all duration-500 ${
          isExpanded ? "max-w-4xl" : "max-w-3xl"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/5 to-blue-500/5 opacity-30 pointer-events-none transition-opacity duration-500"></div>
        <DialogHeader className="relative z-10 border-b border-gray-700 pb-4 transition-colors duration-300">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-400/10 transition-all duration-300 hover:bg-indigo-400/20">
              <Brain className="w-6 h-6 text-indigo-400 transition-transform duration-300 hover:scale-110" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500 transition-all duration-500">
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
                        className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all duration-300 break-words"
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
                        className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all duration-300 break-words"
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
                      <select 
                        className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-400/50 focus:border-indigo-400/50 hover:border-gray-500 transition-all duration-300"
                        value={formData.complexity}
                        onChange={(e) => handleInputChange('complexity', e.target.value)}
                      >
                        <option value="beginner">Beginner (1-2 weeks)</option>
                        <option value="intermediate">Intermediate (1-3 months)</option>
                        <option value="advanced">Advanced (3-6 months)</option>
                        <option value="any">Any</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-700 transition-all duration-300">
                  <div className="text-sm text-gray-400 transition-colors duration-300">
                    This will use 1 credit
                  </div>
                  <div className="flex gap-2 transition-all duration-300">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-600 hover:bg-gray-700 hover:border-gray-500 transition-all duration-300"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-indigo-500 hover:bg-indigo-400 text-white transition-all duration-300"
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
              <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white break-words">
                    {ideas[currentIdeaIndex].title}
                  </h3>
                  <div className="text-sm text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded">
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
                      className="border-gray-600 hover:bg-gray-600 hover:border-gray-500 transition-all duration-300"
                      onClick={handleCopy}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      className="bg-indigo-500 hover:bg-indigo-400 text-white transition-all duration-300"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  className="border-gray-600 hover:bg-gray-700 hover:border-gray-500 transition-all duration-300"
                  onClick={handlePrevious}
                  disabled={currentIdeaIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                <Button
                  variant="outline"
                  className="border-gray-600 hover:bg-gray-700 hover:border-gray-500 transition-all duration-300"
                  onClick={onClose}
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>

                {isLastIdea && (
                  <Button
                    variant="outline"
                    className="border-gray-600 hover:bg-gray-700 hover:border-gray-500 transition-all duration-300"
                    onClick={handleReset}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    New Ideas
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  className="border-gray-600 hover:bg-gray-700 hover:border-gray-500 transition-all duration-300"
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
  );
}