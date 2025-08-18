// app/(sidebar)/user/ai-toolkit/services/StackRecommenderForm.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function StackRecommenderForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-300">Project Type</Label>
        <Input
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="e.g., SaaS, mobile app"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Key Requirements</Label>
        <Textarea
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="e.g., real-time updates, user auth"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Your Preferences</Label>
        <Input
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="e.g., prefer JavaScript"
        />
      </div>
    </div>
  );
}