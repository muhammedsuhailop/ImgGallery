import { RequestHandler, Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { asyncHandler } from "../../../middleware/asyncHandler";
import { validateRequest } from "../../../middleware/validateRequest";
import { upload } from "../../../middleware/upload.middleware";
import {
  uploadBatchSchema,
  updateImageItemSchema,
  rearrangeImagesSchema,
  rearrangeBatchesSchema,
  updateBatchSchema,
} from "../validations/image.validation";
import { imageController } from "../../../container/image.container";

const router = Router();

router.use(authenticate as unknown as RequestHandler);

// POST   /api/images
router.post(
  "/",
  upload.array("images", 20),
  validateRequest(uploadBatchSchema),
  asyncHandler(imageController.uploadBatch),
);

// GET    /api/images
router.get("/", asyncHandler(imageController.getMyBatches));

// PATCH  /api/images/:batchId          
router.patch(
  "/:batchId",
  validateRequest(updateBatchSchema),
  asyncHandler(imageController.updateBatch),
);

// PUT    /api/images/rearrange
router.put(
  "/rearrange",
  validateRequest(rearrangeBatchesSchema),
  asyncHandler(imageController.rearrangeBatches),
);

// GET    /api/images/:batchId
router.get("/:batchId", asyncHandler(imageController.getBatch));

// PATCH  /api/images/:batchId/images/:imageId
router.patch(
  "/:batchId/images/:imageId",
  upload.single("image"),
  validateRequest(updateImageItemSchema),
  asyncHandler(imageController.updateImageItem),
);

// PUT    /api/images/:batchId/rearrange
router.put(
  "/:batchId/rearrange",
  validateRequest(rearrangeImagesSchema),
  asyncHandler(imageController.rearrangeImages),
);

// DELETE /api/images/:batchId/images/:imageId
router.delete(
  "/:batchId/images/:imageId",
  asyncHandler(imageController.deleteImageItem),
);

// DELETE /api/images/:batchId
router.delete("/:batchId", asyncHandler(imageController.deleteBatch));

export default router;
