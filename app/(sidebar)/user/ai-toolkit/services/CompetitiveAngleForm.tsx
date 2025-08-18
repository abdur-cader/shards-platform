// app/(sidebar)/user/ai-toolkit/services/CompetitiveAngleForm.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CompetitiveAngleForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-300">Project Description</Label>
        <Textarea
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="Describe your project in 1-2 sentences"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Competitors</Label>
        <Textarea
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="List similar projects/products (optional)"
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Target Audience</Label>
        <Input
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="e.g., developers, designers, startups"
        />
      </div>
    </div>
  );
}