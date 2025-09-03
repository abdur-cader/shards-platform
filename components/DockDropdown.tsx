import React, { useState, useEffect } from "react";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Link2, Eye, EyeOff, Trash, Router } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  slug: string;
  onDeleteSuccess?: () => void;
}

const DockDropdown = ({ slug, onDeleteSuccess }: Props) => {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch current is_visible value when component mounts
  useEffect(() => {
    const fetchVisibility = async () => {
      const { data, error } = await supabase
        .from("shards")
        .select("is_visible")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Failed to fetch visibility:", error);
        setIsVisible(null);
        return;
      }

      setIsVisible(data.is_visible);
    };

    fetchVisibility();
  }, [slug]);

  const toggleVisibility = async () => {
    if (isVisible === null) return;

    setLoading(true);
    const { error } = await supabase
      .from("shards")
      .update({ is_visible: !isVisible })
      .eq("slug", slug);

    if (error) {
      toast.error("Failed to update visibility");
      console.error("Failed to toggle visibility:", error);
    } else {
      toast.success(
        `Shard successfully made ${!isVisible ? "public" : "private"}`
      );
      setIsVisible(!isVisible);
    }
    setLoading(false);
  };
  const router = useRouter();
  const handleDelete = async () => {
    const deletePromise = new Promise<void>(async (resolve, reject) => {
      const { error } = await supabase.from("shards").delete().eq("slug", slug);

      if (error) return reject(error);
      resolve();
    });

    toast.promise(deletePromise, {
      loading: "Deleting shard...",
      success: () => {
        onDeleteSuccess?.();
        router.back();
        setTimeout(() => {
          window.location.reload();
        }, 50);
        return "Shard deleted successfully";
      },
      error: "Failed to delete shard",
    });
  };

  return (
    <div>
      <DropdownMenuItem
        onClick={() => {
          navigator.clipboard
            .writeText(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/shards/${slug}`)
            .then(() => console.log("Copied!"))
            .catch((err) => console.error("Failed to copy:", err));
          toast.success("Link copied to clipboard");
        }}
      >
        <Link2 className="mr-2 h-4 w-4" />
        Copy link
      </DropdownMenuItem>

      <DropdownMenuItem onClick={toggleVisibility} disabled={loading}>
        {isVisible === null ? (
          "Loading..."
        ) : (
          <>
            {isVisible ? (
              <EyeOff className="mr-2 h-4 w-4" />
            ) : (
              <Eye className="mr-2 h-4 w-4" />
            )}
            {isVisible ? "Make private" : "Make public"}
          </>
        )}
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="text-red-500 focus:text-red-600 cursor-pointer"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Shard
          </DropdownMenuItem>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              This shard will be <b>permanently</b> deleted. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-900 text-red-100 hover:bg-red-700 cursor-pointer"
            >
              Delete Shard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DockDropdown;
