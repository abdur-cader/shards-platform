import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function EditShardPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

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
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Shard</h1>
      <form action={updateShard} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            defaultValue={shard.title}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="desc"
            defaultValue={shard.desc}
            className="w-full border p-2 rounded"
            rows={5}
          />
        </div>
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </main>
  );
}
