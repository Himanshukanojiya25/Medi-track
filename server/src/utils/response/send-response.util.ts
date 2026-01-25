import { Response } from 'express';

interface SendResponseParams<T = any> {
  statusCode: number;
  message?: string;
  data?: T;
}

export const sendResponse = <T>(
  res: Response,
  { statusCode, message, data }: SendResponseParams<T>
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
