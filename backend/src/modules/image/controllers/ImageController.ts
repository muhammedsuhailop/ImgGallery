import { Request, Response } from "express";
import { ApiResponse } from "../../../utils/ApiResponse";
import { IImageService } from "../services/IImageService";
import { AuthRequest } from "../../../middleware/auth.middleware";
import {
  RearrangeImagesDto,
  RearrangeBatchesDto,
} from "../dto/RearrangeImagesDto";
import { HttpStatus } from "../../../constants/httpStatus.constants";
import { ImageMessages } from "../../../constants/imageMessages.constants";
import { getBatchesQuerySchema } from "../validations/image.validation";
import { GetBatchesQueryDto } from "../dto/GetBatchesQueryDto";

export class ImageController {
  constructor(private readonly imageService: IImageService) {}

  uploadBatch = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;

    const files = (req.files ?? []) as Express.Multer.File[];

    const rawTitles: unknown = req.body.titles;
    const titles: string[] = Array.isArray(rawTitles)
      ? (rawTitles as string[])
      : [rawTitles as string];

    const batchTitle: string = req.body.title;

    const visibility: "public" | "private" =
      req.body.visibility === "public" ? "public" : "private";

    const result = await this.imageService.uploadBatch(
      authReq.userId,
      files,
      titles,
      batchTitle,
      visibility,
    );

    res
      .status(HttpStatus.CREATED)
      .json(new ApiResponse(true, ImageMessages.UPLOAD_SUCCESS, result));
  };

  getMyBatches = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;

    const parsed = getBatchesQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(new ApiResponse(false, parsed.error.message));
      return;
    }

    const query: GetBatchesQueryDto = parsed.data;

    const result = await this.imageService.getMyBatches(authReq.userId, query);

    res
      .status(HttpStatus.OK)
      .json(new ApiResponse(true, ImageMessages.BATCHES_RETRIEVED, result));
  };

  getBatch = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;

    const result = await this.imageService.getBatch(
      req.params.batchId as string,
      authReq.userId,
    );

    res
      .status(HttpStatus.OK)
      .json(new ApiResponse(true, ImageMessages.BATCH_RETRIEVED, result));
  };

  updateBatch = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;

    const result = await this.imageService.updateBatch(
      req.params.batchId as string,
      authReq.userId,
      req.body,
    );

    res
      .status(HttpStatus.OK)
      .json(new ApiResponse(true, ImageMessages.BATCH_UPDATED, result));
  };

  updateImageItem = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;

    const file = req.file as Express.Multer.File | undefined;

    const result = await this.imageService.updateImageItem(
      req.params.batchId as string,
      req.params.imageId as string,
      authReq.userId,
      req.body,
      file,
    );

    res
      .status(HttpStatus.OK)
      .json(new ApiResponse(true, ImageMessages.IMAGE_UPDATED, result));
  };

  rearrangeImages = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;

    const data = req.body as RearrangeImagesDto;

    const result = await this.imageService.rearrangeImages(
      req.params.batchId as string,
      authReq.userId,
      data,
    );

    res
      .status(HttpStatus.OK)
      .json(new ApiResponse(true, ImageMessages.IMAGES_REARRANGED, result));
  };

  rearrangeBatches = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;

    const data = req.body as RearrangeBatchesDto;

    const result = await this.imageService.rearrangeBatches(
      authReq.userId,
      data,
    );

    res
      .status(HttpStatus.OK)
      .json(new ApiResponse(true, ImageMessages.BATCHES_REARRANGED, result));
  };

  deleteImageItem = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;

    const result = await this.imageService.deleteImageItem(
      req.params.batchId as string,
      req.params.imageId as string,
      authReq.userId,
    );

    res
      .status(HttpStatus.OK)
      .json(new ApiResponse(true, ImageMessages.IMAGE_DELETED, result));
  };

  deleteBatch = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;

    await this.imageService.deleteBatch(
      req.params.batchId as string,
      authReq.userId,
    );

    res
      .status(HttpStatus.OK)
      .json(new ApiResponse(true, ImageMessages.BATCH_DELETED));
  };
}
