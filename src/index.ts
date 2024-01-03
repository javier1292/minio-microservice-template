// Validate envs
// import "@/utils/envs";

import { OpenAPIHono } from "@hono/zod-openapi";

import { swaggerUI } from "@hono/swagger-ui";
import { tryCatchWrapper } from "./utils";

import { createGetPresignedUrlRoute } from "./routes/createGetPresignedUrlRoute";
import { createPutPresignedUrlRoute } from "./routes/createPutPresignedUrlRoute";

import {
  createMinioGetObjectPresignedUrl,
  createMinioPutObjectPresignedUrl
} from "./utils/minio";
import { cors } from "hono/cors";

const app = new OpenAPIHono();

app.use(
  "*",
  cors({
    origin: "*"
  })
);

app.use("/api/v1/minio/*");

app.openapi(createPutPresignedUrlRoute, async (c) => {
  const query = c.req.valid("query");

  const [url, error] = await tryCatchWrapper(
    createMinioPutObjectPresignedUrl(query)
  );

  if (!url || error) {
    return c.json({ error: "Error creating presigned url" }, { status: 500 });
  }

  return c.json({
    data: {
      url
    }
  });
});

app.openapi(createGetPresignedUrlRoute, async (c) => {
  const query = c.req.valid("query");

  const [url, error] = await tryCatchWrapper(
    createMinioGetObjectPresignedUrl(query)
  );

  if (!url || error) {
    return c.json({ error: "Error creating presigned url" }, { status: 500 });
  }

  return c.json({
    data: {
      url
    }
  });
});

app.get("/api/v1/me", async (c) => {
  const header = c.req.header("authorization");
  const token = header?.split("|")[1] as string;

  const hashedToken = token;

  return c.json({
    status: 200,
    mensaje: "User retrieved successfully",
    data: {
      id: 1,
      email: "admin@pruebas.com",
      email_verified_at: null,
      status: "active",
      created_at: "2023-10-15T01:59:36.000000Z",
      updated_at: "2023-10-15T01:59:36.000000Z"
    }
  });
});

app.openAPIRegistry.registerComponent("securitySchemes", "Authorization", {
  type: "apiKey",
  name: "Authorization",
  in: "header"
});

app.doc("/api/openapi.json", {
  info: {
    title: "Odontoffice MINIO API",
    version: "v1"
  },
  openapi: "3.1.0"
});

app.get("/api/documentation", swaggerUI({ url: "/api/openapi.json" }));

export default app;
