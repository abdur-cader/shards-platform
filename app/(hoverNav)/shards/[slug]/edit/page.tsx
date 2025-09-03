import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";

// Add this interface to define the expected params
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditShardPage({ params }: PageProps) {
  // Await the params promise
  const { slug } = await params;

  const { data: shard, error } = await supabase
    .from("shards")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!shard || error) return notFound();

  async function updateShard(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const desc = formData.get("desc") as string;

    const slug = title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "");

    const { error: updateError } = await supabase
      .from("shards")
      .update({ title, desc, slug })
      .eq("id", shard.id);

    if (updateError) throw new Error(updateError.message);

    revalidatePath(`/shards/${slug}`);
    redirect(`/shards/${slug}`);
  }

  return (
    <div className="min-h-screen flex items-center bg-gradient-to-br from-[#e6f4e6] to-[#d4e9d4] dark:bg-gradient-to-br dark:from-[#071407] dark:to-[#010301] justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-[400] flex items-center font-prompt">
            <PencilIcon className="ml-1 mr-2" />
            Edit
          </CardTitle>
          <CardDescription>
            Update the title and description of your shard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateShard} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                defaultValue={shard.title}
                placeholder="Enter a title for your shard"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                name="desc"
                defaultValue={shard.desc}
                placeholder="Describe your shard"
                rows={5}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
