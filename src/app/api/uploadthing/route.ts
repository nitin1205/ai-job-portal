import { createRouteHandler } from "uploadthing/next";

import { customFileRouter } from "@/services/uploadThing/router";

export const { GET, POST } = createRouteHandler({
  router: customFileRouter,
});
