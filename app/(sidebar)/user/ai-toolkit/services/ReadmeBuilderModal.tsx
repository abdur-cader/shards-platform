"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ShardSelector from "@/components/ShardSelector";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Define the schema for form validation
const readmeFormSchema = z.object({
  shardId: z.string().min(1, "Please select a shard"),
  description: z.string()
    .min(40, "Description must be at least 40 characters if provided")
    .max(1000, "Description too long")
    .optional()
    .or(z.literal("")),
  features: z.string()
    .min(40, "Features must be at least 40 characters if provided")
    .max(1000, "Features list too long")
    .optional()
    .or(z.literal(""))
});

type ReadmeFormValues = z.infer<typeof readmeFormSchema>;

export default function ReadmeBuilderModal({ onClose }: { onClose: () => void }) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedShard, setSelectedShard] = useState<{ id: string } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<ReadmeFormValues>({
    resolver: zodResolver(readmeFormSchema),
    defaultValues: {
      description: "",
      features: ""
    }
  });

  const onSubmit = async (data: ReadmeFormValues) => {
    if (!selectedShard) {
      toast.error('Please select a shard');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-toolkit/readme-builder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'sb-access-token': session?.supabaseAccessToken!,
          'session-id': session?.user.id!,
        },
        body: JSON.stringify({
          shardId: selectedShard.id,
          description: data.description, // User-entered description (Optional)
          features: data.features, // user entered key features (Optional)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate README');
      }

      const result = await response.json();
      onClose();
      reset();
      toast.success('README generated successfully!');
    } catch (error) {
      console.error('Error generating README:', error);
      toast.error('Failed to generate README. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => {
      if (!open) {
        reset();
        onClose();
      }
    }}>
      <DialogContent className="min-w-4xl bg-gray-950 border border-gray-800/70 rounded-2xl font-prompt overflow-hidden backdrop-blur-sm shadow-2xl">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900/10 to-gray-950/80 opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 overflow-hidden opacity-15">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/5 rounded-full filter blur-3xl animate-float-slow"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/5 rounded-full filter blur-3xl animate-float-slow animation-delay-2000"></div>
          <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-amber-500/3 rounded-full filter blur-xl animate-float"></div>
        </div>

        <DialogHeader className="relative z-10 border-b border-gray-800/50 pb-4">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-400 font-semibold text-xl tracking-tight">
              README Builder
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="relative z-10 py-6">
          <div className="space-y-8">
            <div className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-6 backdrop-blur-sm shadow-inner shadow-gray-900/50">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Shard
                    </label>
                    <ShardSelector 
                      userId={session?.user?.id || ""} 
                      accessToken={session?.supabaseAccessToken} 
                      onShardSelect={(shard) => {
                        setSelectedShard(shard);
                        setValue("shardId", shard.id);
                      }}
                    />
                    {errors.shardId && (
                      <p className="mt-1 text-sm text-red-400">{errors.shardId.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description (optional)
                    </label>
                    <textarea
                      {...register("description")}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      rows={3}
                      placeholder="Brief description of what your project does (min 40 chars if provided)..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Key Features (optional)
                    </label>
                    <textarea
                      {...register("features")}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      rows={3}
                      placeholder="List key features, one per line (min 40 chars if provided)..."
                    />
                    {errors.features && (
                      <p className="mt-1 text-sm text-red-400">{errors.features.message}</p>
                    )}
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-800/50">
              <div className="text-sm text-gray-400 font-medium">
                <span className="text-emerald-400 font-semibold">1 credit</span> will be used
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-gray-600 transition-all px-6 hover:text-white text-gray-300"
                  onClick={() => {
                    reset();
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white transition-all px-8 shadow-lg hover:shadow-emerald-500/30 disabled:opacity-70 group"
                  disabled={isLoading || !selectedShard}
                  onClick={handleSubmit(onSubmit)}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    <>
                      Generate README
                      <span className="ml-2 opacity-80 group-hover:opacity-100 transition-opacity">✨</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}