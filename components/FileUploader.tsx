"use client";
import React, { useState, useCallback } from "react";
import { FileUpload } from "@/components/ui/file-upload";

interface FileUploaderProps {
  onFileSelect: (file: File[]) => void;
}

export function FileUploader({ onFileSelect }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;

    setFiles(files);
    onFileSelect(files);
  }, [onFileSelect]);

  return (
    <div>
      <FileUpload onChange={handleFileUpload} value={files}/>
    </div>
  );
}
