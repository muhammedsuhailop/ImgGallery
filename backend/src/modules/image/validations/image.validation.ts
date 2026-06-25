import { z } from "zod";

export const uploadBatchSchema = z.object({
  title: z.string().trim().min(1, "Batch title is required"),
  titles: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .refine((arr) => arr.every((t) => t.trim().length > 0), {
      message: "Each title must be a non-empty string",
    }),

  visibility: z.enum(["public", "private"]).default("private"),
});

export const updateBatchSchema = z.object({
  title: z.string().trim().min(1, "Batch title is required"),
});

export const updateImageItemSchema = z.object({
  title: z.string().trim().min(1).optional(),
});

export const rearrangeImagesSchema = z.object({
  orderedImages: z
    .array(
      z.object({
        imageId: z.string().min(1),
        order: z.number().int().min(0),
      }),
    )
    .min(1, "orderedImages must have at least one entry"),
});

export const rearrangeBatchesSchema = z.object({
  orderedBatches: z
    .array(
      z.object({
        batchId: z.string().min(1),
        order: z.number().int().min(0),
      }),
    )
    .min(1, "orderedBatches must have at least one entry"),
});

export const getBatchesQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? parseInt(val, 10) : 1))
    .pipe(z.number().int().min(1, "page must be at least 1")),

  limit: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? parseInt(val, 10) : 10))
    .pipe(z.number().int().min(1).max(100, "limit must be at most 100")),

  sortBy: z.enum(["createdAt", "updatedAt", "title", "order"]).default("order"),

  sortOrder: z.enum(["asc", "desc"]).default("asc"),

  visibility: z.enum(["public", "private", "all"]).default("all"),
});