import * as Minio from "minio";

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || "localhost";
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || "minio";
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || "minio123";

export const minioClient = new Minio.Client({
  endPoint: MINIO_ENDPOINT,
  useSSL: true,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY
});
