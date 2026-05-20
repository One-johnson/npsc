"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { ImagePlus, Loader2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  sessionToken: string;
  previewUrl: string | null;
  onUploaded: (storageId: Id<"_storage">, previewUrl: string) => void;
  onClear?: () => void;
  disabled?: boolean;
};

export function EventHeroUpload({
  sessionToken,
  previewUrl,
  onUploaded,
  onClear,
  disabled,
}: Props) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller");
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl({ sessionToken });
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
      const localPreview = URL.createObjectURL(file);
      onUploaded(storageId, localPreview);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const displayUrl = previewUrl;

  return (
    <div className="space-y-2">
      <Label>Hero image</Label>
      <div
        className={cn(
          "relative flex min-h-[140px] flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/30",
          disabled && "pointer-events-none opacity-60"
        )}
      >
        {displayUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displayUrl}
            alt="Event hero preview"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <p className="px-4 text-center text-xs text-muted-foreground">
            Upload a conference banner (PNG or JPG, max 5 MB)
          </p>
        )}
        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
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
          <ImagePlus className="mr-2 size-4" />
          {displayUrl ? "Replace image" : "Upload image"}
        </Button>
        {displayUrl && onClear ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled || uploading}
            onClick={onClear}
          >
            Remove
          </Button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
