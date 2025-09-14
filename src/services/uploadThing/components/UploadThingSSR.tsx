import { connection } from "next/server";
import { extractRouterConfig } from "uploadthing/server";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";

import { customFileRouter } from "../router";
import { Suspense } from "react";

export function UploadThingSSR() {
  return (
    <Suspense>
      <UTSSR />
    </Suspense>
  );
}

export async function UTSSR() {
  await connection();
  return <NextSSRPlugin routerConfig={extractRouterConfig(customFileRouter)} />;
}
