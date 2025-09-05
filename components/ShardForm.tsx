"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileUploader } from "./FileUploader";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useState } from "react";

const shardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  desc: z.string().min(1, "Description is required"),
  github_repo: z.string().min(1, "Select a repository."),
  image_url: z.array(z.string().url("Invalid image URL")).optional(),
  files: z.array(z.any()).optional(),
});

type ShardFormData = z.infer<typeof shardSchema>;

interface ShardFormProps {
  repos: { name: string; full_name: string; html_url: string }[];
}

export default function ShardForm({ repos }: ShardFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ShardFormData & { files?: File[] }>({
    resolver: zodResolver(shardSchema),
    defaultValues: {
      github_repo: "",
      title: "",
      desc: "",
      image_url: undefined,
      files: [],
    },
  });

  const onSubmit = async (formData: ShardFormData & { files?: File[] }) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Creating your Shard...");

    console.log("Valid Form Data:", formData);

    const slug = formData.title.trim().toLowerCase().replace(/\s+/g, "-");

    let image_urls: string[] = [];

    try {
      // Handle file uploads if files exist
      console.log("FILES INSIDE FORM DATA:", formData.files);
      if (formData.files && formData.files.length > 0) {
        toast.loading("Uploading files...", { id: toastId });

        for (const file of formData.files) {
          if (!file) continue;

          const sanitizedFileName = file.name.replace(/\s+/g, "_");
          const filePath = `shards/${Date.now()}-${sanitizedFileName}`;

          // Upload the file
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("shard-image-uploads")
              .upload(filePath, file);

          if (uploadError) {
            console.error("Upload error:", uploadError);
            toast.error(
              `Upload failed for ${file.name}: ${uploadError.message}`,
              { id: toastId }
            );
            continue;
          }

          // Get public URL
          const {
            data: { publicUrl },
          } = supabase.storage
            .from("shard-image-uploads")
            .getPublicUrl(uploadData.path);

          if (publicUrl) {
            image_urls.push(publicUrl);
          }
        }
      }

      const selectedRepo = repos.find(
        (repo) => repo.full_name === formData.github_repo
      );
      const dbData = {
        title: formData.title,
        desc: formData.desc,
        github_repo: selectedRepo?.html_url || "",
        image_url: image_urls,
        slug,
        user_id: session?.user?.id,
        user_github_id: session?.user?.github_id,
      };

      toast.loading("Saving your Shard...", { id: toastId });

      const { error: insertError } = await supabase
        .from("shards")
        .insert([dbData]);

      if (insertError) {
        toast.error(`Insert failed: ${insertError.message}`, { id: toastId });
      } else {
        toast.success("Your Shard has been created", { id: toastId });
        router.push(`/shards/${slug}?edit=1`);
      }
    } catch (error) {
      console.error("Error creating Shard:", error);
      toast.error("Failed to create Shard. Please try again.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 max-w-2xl mx-auto mt-6"
      >
        <FormField
          control={form.control}
          name="github_repo"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full border roudned p-2 cursor-pointer">
                    <SelectValue
                      placeholder="Select a repository"
                      className="cursor-pointer"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {repos.map((repo) => (
                    <SelectItem
                      key={repo.full_name}
                      value={repo.full_name}
                      className="cursor-pointer"
                    >
                      {repo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Shard Title"
                  className="w-full border rounded p-2 "
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="This project demonstrates why some apples are green"
                  className="w-full border rounded p-2"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FileUploader
          onFileSelect={(files) => {
            console.log("✅ onFileSelect triggered with:", files);
            form.setValue("files", files, { shouldValidate: true });
          }}
        />

        <Button
          type="submit"
          className="px-4 py-2 rounded-4xl cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Shard"}
        </Button>
      </form>
    </Form>
  );
}
