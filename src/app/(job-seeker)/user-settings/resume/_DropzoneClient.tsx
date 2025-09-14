"use client";

import { useRouter } from "next/navigation";

import { UploadDropzone } from "@/services/uploadThing/components/UploadThing";

export function DropzoneClient() {
  const router = useRouter();
  return (
    <UploadDropzone
      endpoint="resumeUploader"
      onClientUploadComplete={() => router.refresh()}
    />
  );
}
