import { minioClient } from "@/lib/minio";
import { createMinioFileName, tryCatchWrapper } from "@/utils";
import { env } from "@/utils/env";

const BUCKET_NAME = env.MINIO_BUCKET_NAME;

export const createMinioBucket = async (bucketName: string) => {
  const bucketExists = await minioClient.bucketExists(bucketName);

  if (bucketExists) return;

  await minioClient.makeBucket(bucketName);
};

if (!BUCKET_NAME) {
  throw new Error("BUCKET_NAME env is required");
}

type CreateGetPresignedUrlProps = {
  folderName: string;
  fileName: string;
  expires?: number;
};

export const createMinioGetObjectPresignedUrl = async ({
  fileName,
  folderName,
  expires
}: CreateGetPresignedUrlProps) => {
  const name = `${folderName}/${fileName}`;

  const [file, fileError] = await tryCatchWrapper(
    minioClient.getObject(BUCKET_NAME, name)
  );

  if (!file || fileError) {
    return undefined;
  }

  const [url, urlError] = await tryCatchWrapper(
    minioClient.presignedGetObject(BUCKET_NAME, name, expires || 100)
  );

  if (!url || urlError) {
    return undefined;
  }

  return url;
};

type CreatePutPresignedUrlProps = {
  folderName: string;
  fileName: string;
  expires?: number;
};

export const createMinioPutObjectPresignedUrl = async ({
  fileName,
  folderName,
  expires
}: CreatePutPresignedUrlProps) => {
  createMinioBucket(BUCKET_NAME);

  const minioFilename = createMinioFileName(folderName, fileName);

  const url = await minioClient.presignedPutObject(
    BUCKET_NAME,
    minioFilename,
    expires || 100
  );

  return url;
};
