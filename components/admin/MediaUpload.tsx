"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FileUp, Loader2, Trash2, ExternalLink } from "lucide-react";

type Props = {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  onUploadComplete?: (url: string) => void | Promise<void>;
  folder: "projects" | "resume" | "avatar" | "hero" | "icons" | "services" | "misc";
  accept?: string;
  resourceType?: "image" | "raw";
  preview?: "image" | "file" | "none";
  aspect?: "square" | "video" | "wide";
};

export default function MediaUpload({
  label,
  hint,
  value,
  onChange,
  onUploadComplete,
  folder,
  accept = "image/jpeg,image/png,image/webp,image/gif",
  resourceType = "image",
  preview = "image",
  aspect = "video",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setUploading(true);
    setError("");

    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);
    body.append("resourceType", resourceType);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onChange(data.url);
      await onUploadComplete?.(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "wide"
        ? "aspect-[21/9]"
        : "aspect-video";

  const isPdf = value.toLowerCase().includes(".pdf") || resourceType === "raw";

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-[var(--color-muted)]">
          {label}
        </label>
        {hint && <p className="mt-0.5 text-xs text-[var(--color-muted)]">{hint}</p>}
      </div>

      {preview !== "none" && value && (
        <div
          className={`relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] ${aspectClass} max-h-56`}
        >
          {preview === "image" && !isPdf ? (
            <Image src={value} alt="" fill className="object-cover" unoptimized />
          ) : (
            <div className="flex h-full min-h-[120px] flex-col items-center justify-center gap-2 p-4 text-center">
              <p className="text-sm font-medium">File uploaded</p>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[var(--color-accent-soft)] hover:underline"
              >
                Open file <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      )}

      <div
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 transition ${
          uploading
            ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
            : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-surface)]"
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        {uploading ? (
          <Loader2 className="animate-spin text-[var(--color-accent-soft)]" size={28} />
        ) : (
          <FileUp className="text-[var(--color-muted)]" size={28} />
        )}
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          {uploading ? "Uploading to Cloudinary…" : "Drag & drop or click to upload"}
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn-secondary mt-4 !py-2 !text-xs"
        >
          Choose file
        </button>
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste a URL"
        className="input-field !text-xs"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="inline-flex items-center gap-1 text-xs text-red-400 hover:underline"
        >
          <Trash2 size={12} />
          Remove
        </button>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
