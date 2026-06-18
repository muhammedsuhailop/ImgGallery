import { z } from "zod";

export const uploadBatchSchema = z.object({
  titles: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .refine((arr) => arr.every((t) => t.trim().length > 0), {
      message: "Each title must be a non-empty string",
    }),

  visibility: z.enum(["public", "private"]).default("private"),
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
