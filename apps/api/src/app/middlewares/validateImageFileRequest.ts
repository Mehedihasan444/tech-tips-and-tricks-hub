/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { catchAsync } from "../utils/catchAsync";

const validateImageFileRequest = (schema: ZodType) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsedFile = (await schema.parseAsync({
      files: (req as any).files,
    })) as { files: unknown };
    (req as any).files = parsedFile.files;

    next();
  });
};

export default validateImageFileRequest;
