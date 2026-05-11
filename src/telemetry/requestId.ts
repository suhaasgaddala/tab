import type { NextFunction, Request, Response } from "express";

declare module "express-serve-static-core" {
  interface Request {
    requestId?: string;
  }
}

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const incoming = req.get("x-request-id");
  const requestId = incoming?.trim() || createRequestId();

  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);
  next();
}

function createRequestId() {
  const random = Math.random().toString(36).slice(2, 14);
  return `req_${Date.now().toString(36)}_${random}`;
}
