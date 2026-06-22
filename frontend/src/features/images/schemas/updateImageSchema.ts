import { z } from "zod";

export const updateImageSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
});

export type UpdateImageFormValues = z.infer<typeof updateImageSchema>;

export const updateAlbumTitleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Album title is required")
    .max(100, "Album title must be 100 characters or less"),
});

export type UpdateAlbumTitleFormValues = z.infer<typeof updateAlbumTitleSchema>;
