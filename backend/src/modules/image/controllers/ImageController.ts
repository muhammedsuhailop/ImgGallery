import { Request, Response } from "express";
import { ApiResponse } from "../../../utils/ApiResponse";
import { IImageService } from "../services/IImageService";
import { AuthRequest } from "../../../middleware/auth.middleware";
import {
  RearrangeImagesDto,
  RearrangeBatchesDto,
} from "../dto/RearrangeImagesDto";

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
      .status(201)
      .json(new ApiResponse(true, "Images uploaded successfully", result));
  };

  getMyBatches = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;

    const result = await this.imageService.getMyBatches(authReq.userId);

    res.status(200).json(new ApiResponse(true, "Batches retrieved", result));
  };

  getBatch = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;

    const result = await this.imageService.getBatch(
      req.params.batchId as string,
      authReq.userId,
    );

    res.status(200).json(new ApiResponse(true, "Batch retrieved", result));
  };

  updateBatch = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;

    const result = await this.imageService.updateBatch(
      req.params.batchId as string,
      authReq.userId,
      req.body,
    );

    res.status(200).json(new ApiResponse(true, "Batch updated", result));
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

    res.status(200).json(new ApiResponse(true, "Image updated", result));
  };

  rearrangeImages = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;

    const data = req.body as RearrangeImagesDto;

    const result = await this.imageService.rearrangeImages(
      req.params.batchId as string,
      authReq.userId,
      data,
    );

    res.status(200).json(new ApiResponse(true, "Images rearranged", result));
  };

  rearrangeBatches = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;

    const data = req.body as RearrangeBatchesDto;

    const result = await this.imageService.rearrangeBatches(
      authReq.userId,
      data,
    );

    res.status(200).json(new ApiResponse(true, "Batches rearranged", result));
  };

  deleteImageItem = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;

    const result = await this.imageService.deleteImageItem(
      req.params.batchId as string,
      req.params.imageId as string,
      authReq.userId,
    );

    res.status(200).json(new ApiResponse(true, "Image deleted", result));
  };

  deleteBatch = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;

    await this.imageService.deleteBatch(
      req.params.batchId as string,
      authReq.userId,
    );

    res.status(200).json(new ApiResponse(true, "Batch deleted"));
  };
}
