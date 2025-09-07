import ShardsClient from "./shardsClient";
import { BGPattern } from "@/components/bg-pattern";

async function getShards(page: number = 1, limit: number = 20) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/shards/explore?page=${page}&limit=${limit}`,
      {
        next: { revalidate: 60 }, // Optional: add revalidation for ISR
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch shards: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching shards:", error);
    throw error;
  }
}

interface PageProps {
  searchParams: {
    page?: string;
  };
}

export default async function ShardsPage({ searchParams }: PageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const limit = 20;

  let shardsData;
  try {
    shardsData = await getShards(currentPage, limit);
  } catch (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-xl w-full p-6 bg-red-100 border border-red-400 text-red-800 rounded-lg shadow-sm text-center">
          <p className="text-lg font-semibold">Failed to load Shards</p>
          <p className="mt-2 text-sm">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  const { shards, totalPages, totalShards } = shardsData;

  if (!shards || shards.length === 0) return <div>no shards found</div>;

  return (
    <div
      className="min-h-screen 
                      relative
                      bg-gradient-to-br 
                      from-gray-50 via-gray-100 to-gray-200 
                      dark:from-[#0c0c0c] dark:via-[#4f6930]/7 dark:to-[#0c0c0c] 
                      shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.5)]"
    >
      <BGPattern
        variant="dots"
        mask="fade-center"
        className="absolute inset-0 z-0 pointer-events-none"
      />
      <ShardsClient
        shards={shards}
        currentPage={currentPage}
        totalPages={totalPages || 1}
        totalShards={totalShards || shards.length}
      />
    </div>
  );
}
