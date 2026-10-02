import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { catchAsync } from "../utils/catchAsync";

const validateRequest = (schema: ZodType) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsedBody = (await schema.parseAsync({
      body: req.body,
    })) as { body: unknown };

    req.body = parsedBody.body;

    next();
  });
};

export const validateRequestCookies = (schema: ZodType) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsedCookies = (await schema.parseAsync({
      cookies: req.cookies,
    })) as { cookies: Record<string, string> };

    req.cookies = parsedCookies.cookies;

    next();
  });
};

export default validateRequest;
