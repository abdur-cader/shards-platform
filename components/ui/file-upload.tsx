import { cn } from "@/lib/utils";
import React, { useRef, useCallback } from "react";
import { motion } from "motion/react";
import { IconUpload, IconX } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";


const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
  value = [],
}: {
  onChange?: (files: File[]) => void;
  value?: File[];
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleFileChange = useCallback((newFiles: File[]) => {
    const existingFiles = new Set(value.map(f => f.name + f.size));
    const filtered = newFiles.filter(f => !existingFiles.has(f.name + f.size));

    const total = value.length + filtered.length;

    if (total > 5) {
      toast.error("You can only upload a maximum of 5 images.");
      return;
    }

    const updatedFiles = [...value, ...filtered];
    onChange?.(updatedFiles);
  }, [value, onChange]);

  const handleRemoveFile = useCallback((index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange?.(newFiles);
  }, [value, onChange]);
  

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] }, // only images allowed
    multiple: true,
    noClick: true,

    onDrop: (acceptedFiles) => {
      // only accepted files come here
      handleFileChange(acceptedFiles);
    },

    onDropRejected: (fileRejections) => {
      // this is called immediately for rejected files
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach(e => {
          toast.error(`Rejected "${file.name}": You may only upload Images.`);
        });
      });
    },
  });

  return (
  <div
    className={cn(
      "w-full rounded-xl border-2 border-dashed transition-colors duration-300 p-15",
      isDragActive
        ? "border-green-500"
        : "border-neutral-300 dark:border-neutral-700"
    )}
    {...getRootProps()}
  >
    <motion.div
      onClick={handleClick}
      whileHover="animate"
      className="cursor-pointer w-full relative"
    >
      <input
        ref={fileInputRef}
        id="file-upload-handle"
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center text-center px-4">
        <p className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Upload images (max. 5)
        </p>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Drag & drop or click to browse
        </p>
      </div>

      <div className="relative w-full mt-8 max-w-2xl mx-auto">
        {value.length > 0 ? (
          value.map((file, idx) => (
            <motion.div
              key={"file" + idx}
              layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
              className={cn(
                "rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4 mt-4 shadow-sm"
              )}
            >
              <div className="flex justify-between items-center">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layout
                  className="text-neutral-800 dark:text-neutral-200 truncate max-w-xs text-sm"
                >
                  {file.name}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layout
                  className="text-sm text-neutral-500 dark:text-neutral-400"
                >
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </motion.p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(idx);
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                  aria-label="Remove file"
                >
                  <IconX className="h-4 w-4" />
                </button>
              </div>

              <div className="flex justify-between items-center mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layout
                  className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded"
                >
                  {file.type}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layout
                >
                  modified {new Date(file.lastModified).toLocaleDateString()}
                </motion.p>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            layoutId="file-upload"
            variants={mainVariant}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md border border-neutral-200 dark:border-neutral-700"
          >
            {isDragActive ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-600 dark:text-green-400 flex flex-col items-center"
              >
                Drop it!
                <IconUpload className="h-5 w-5 mt-1" />
              </motion.p>
            ) : (
              <IconUpload className="h-5 w-5 text-neutral-400" />
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  </div>
)};