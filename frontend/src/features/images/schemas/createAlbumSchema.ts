import { z } from "zod";

const fileSchema = z.custom<File>((value) => value instanceof File, {
  message: "Invalid file",
});

export const createAlbumSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Album title is required")
    .max(100, "Album title must be 100 characters or less"),
  visibility: z.enum(["public", "private"], {
    message: "Select a visibility",
  }),
  images: z
    .array(
      z.object({
        file: fileSchema,
        title: z
          .string()
          .trim()
          .min(1, "Image title is required")
          .max(100, "Image title must be 100 characters or less"),
      }),
    )
    .min(1, "At least one image is required"),
});

export type CreateAlbumFormValues = z.infer<typeof createAlbumSchema>;

export const addImagesSchema = z.object({
  images: z
    .array(
      z.object({
        file: fileSchema,
        title: z
          .string()
          .trim()
          .min(1, "Image title is required")
          .max(100, "Image title must be 100 characters or less"),
      }),
    )
    .min(1, "At least one image is required"),
});

export type AddImagesFormValues = z.infer<typeof addImagesSchema>;
