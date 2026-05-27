"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { FileUp, Loader2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,application/pdf";

type Props = {
  value?: string;
  previewUrl?: string | null;
  onChange: (storageId: Id<"_storage"> | undefined, previewUrl: string | null) => void;
  disabled?: boolean;
  error?: string;
};

export function StudentIdUpload({
  value,
  previewUrl,
  onChange,
  disabled,
  error,
}: Props) {
  const generateUploadUrl = useMutation(api.files.generateStudentIdUploadUrl);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(file: File) {
    const allowed =
      file.type.startsWith("image/") || file.type === "application/pdf";
    if (!allowed) {
      setUploadError("Upload a JPG, PNG, WebP, or PDF file");
      return;
    }
    if (file.size > MAX_BYTES) {
      setUploadError("File must be 5 MB or smaller");
      return;
    }

    setUploadError(null);
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl({});
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!response.ok) {
        throw new Error("Upload failed");
      }
      const { storageId } = (await response.json()) as {
        storageId: Id<"_storage">;
      };
      const localPreview =
        file.type === "application/pdf"
          ? null
          : URL.createObjectURL(file);
      onChange(storageId, localPreview);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
      onChange(undefined, null);
    } finally {
      setUploading(false);
    }
  }

  const hasFile = Boolean(value);
  const displayError = error ?? uploadError;

  return (
    <div className={cn("grid gap-2 sm:col-span-2", disabled && "opacity-60")}>
      <Label htmlFor="student-id-upload">Student ID</Label>
      <p className="text-xs text-muted-foreground">
        Upload a clear photo or scan of your valid student ID (JPG, PNG, WebP, or
        PDF, max 5 MB).
      </p>
      <div
        className={cn(
          "flex min-h-[100px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-4 py-4 text-center text-xs text-muted-foreground",
          hasFile && "border-primary/40 bg-primary/5"
        )}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Student ID preview"
            className="max-h-32 rounded-md object-contain"
          />
        ) : hasFile ? (
          <p className="font-medium text-foreground">Student ID uploaded</p>
        ) : (
          <p>No file selected</p>
        )}
        {uploading ? (
          <Loader2 className="mt-2 size-5 animate-spin text-primary" />
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          id="student-id-upload"
          type="file"
          accept={ACCEPT}
          className="sr-only"
          disabled={disabled || uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
        >
          <FileUp className="mr-2 size-4" />
          {hasFile ? "Replace file" : "Upload student ID"}
        </Button>
        {hasFile ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled || uploading}
            onClick={() => onChange(undefined, null)}
          >
            Remove
          </Button>
        ) : null}
      </div>
      {displayError ? (
        <p className="text-sm text-destructive">{displayError}</p>
      ) : null}
    </div>
  );
}
