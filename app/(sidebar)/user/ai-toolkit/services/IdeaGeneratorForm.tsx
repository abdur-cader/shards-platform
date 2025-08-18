// app/(sidebar)/user/ai-toolkit/services/IdeaGeneratorForm.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function IdeaGeneratorForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-300">Topic or Interest</Label>
        <Input
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="e.g., AI tools for developers"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Your Skills</Label>
        <Input
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="e.g., React, Python, Machine Learning"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Project Complexity</Label>
        <select className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-400/50 focus:border-indigo-400/50 hover:border-gray-500 transition-all">
          <option value="beginner">Beginner (1-2 weeks)</option>
          <option value="intermediate">Intermediate (1-3 months)</option>
          <option value="advanced">Advanced (3-6 months)</option>
        </select>
      </div>
    </div>
  );
}