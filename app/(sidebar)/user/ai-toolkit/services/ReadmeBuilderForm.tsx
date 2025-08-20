// "use client";
// import { useState } from "react";
// import { useSession } from "next-auth/react";
// import ShardSelector from "@/components/ShardSelector";

// interface ReadmeBuilderFormProps {
//   onSubmit: (data: {
//     shardId: string;
//     description: string;
//     features: string;
//   }) => Promise<void>;
//   isLoading: boolean;
// }

// export default function ReadmeBuilderForm({ onSubmit, isLoading }: ReadmeBuilderFormProps) {
//   const { data: session } = useSession();
//   const [description, setDescription] = useState("");
//   const [features, setFeatures] = useState("");
//   const [selectedShard, setSelectedShard] = useState<{ id: string } | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedShard) return;
    
//     await onSubmit({
//       shardId: selectedShard.id,
//       description,
//       features,
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-2">
//             Select Shard
//           </label>
//           <ShardSelector 
//             userId={session?.user?.id || ""} 
//             accessToken={session?.supabaseAccessToken} 
//             onShardSelect={(shard) => setSelectedShard(shard)}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-2">
//             Description (optional)
//           </label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
//             rows={3}
//             placeholder="Brief description of what your project does..."
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-2">
//             Key Features (optional)
//           </label>
//           <textarea
//             value={features}
//             onChange={(e) => setFeatures(e.target.value)}
//             className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
//             rows={3}
//             placeholder="List key features, one per line..."
//           />
//         </div>
//       </div>
//     </form>
//   );
// }