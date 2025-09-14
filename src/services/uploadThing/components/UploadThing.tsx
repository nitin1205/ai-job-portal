"use client";

import { generateUploadDropzone } from "@uploadthing/react";
import { ComponentProps } from "react";
import { toast } from "sonner";
import { UploadThingError } from "uploadthing/server";
import { Json } from "@uploadthing/shared";

import { CustomFileRouter } from "../router";
import { cn } from "@/lib/utils";

const UploadDropzoneComponent = generateUploadDropzone<CustomFileRouter>();

export function UploadDropzone({
  className,
  onClientUploadComplete,
  onUploadError,
  ...props
}: ComponentProps<typeof UploadDropzoneComponent>) {
  return (
    <UploadDropzoneComponent
      {...props}
      className={cn(
        "border-dashed border-2 border-muted rounded-lg flex items-center justify-center",
        className
      )}
      onClientUploadComplete={(res) => {
        res.forEach(({ serverData }) => {
          toast.success(serverData.messages);
        });
        onClientUploadComplete?.(res);
      }}
      onUploadError={(error: UploadThingError<Json>) => {
        toast.error(error.message);
        onUploadError?.(error);
      }}
    />
  );
}
