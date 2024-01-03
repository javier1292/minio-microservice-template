import { createRoute, z } from "@hono/zod-openapi";

const querySchema = z.object({
  fileName: z.string().min(3),
  folderName: z.string().min(3)
});

const schema = z.object({
  data: z.object({
    url: z.string().url()
  })
});

export const createPutPresignedUrlRoute = createRoute({
  method: "get",
  path: "/api/v1/minio/create-put-presigned-url",
  tags: ["minio"],
  request: {
    query: querySchema
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: schema
        }
      },
      description: "Create a presigned url for put object"
    }
  }
});
