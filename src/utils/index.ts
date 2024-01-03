import { ZodError } from "zod";

export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

export const createMinioFileName = (folder: string, fileName: string) => {
  const date = Date.now();

  return `${slugify(folder)}/${date}-${slugify(fileName)}`;
};

/**
 * Wraps a promise in a try-catch block and returns the result or error.
 * @param promise The promise to be wrapped.
 * @returns A tuple containing the result or null, and the error or null.
 */
export const tryCatchWrapper = async <T, E = Error>(
  promise: Promise<T>
): Promise<[T | null, E | null]> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error as E];
  }
};

export const formatZodErrors = (error: ZodError) => {
  return error.issues.map((issue) => {
    const path = issue.path.join(".");
    return {
      path,
      message: issue.message
    };
  });
};
