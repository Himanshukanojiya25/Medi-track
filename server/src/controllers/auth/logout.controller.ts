import { Request, Response } from "express";
import {
  logoutService,
  logoutAllService,
} from "../../services/auth/logout.service";
import { AUTH_ERROR_MESSAGES } from "../../constants/auth";

/**
 * ============================
 * 🔓 LOGOUT (SINGLE DEVICE)
 * ============================
 * Revokes ONE refresh token
 */
export async function logoutController(req: Request, res: Response) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: AUTH_ERROR_MESSAGES.TOKEN_MISSING,
    });
  }

  await logoutService(refreshToken);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}

/**
 * ============================
 * 🔓 LOGOUT (ALL DEVICES)
 * ============================
 * Revokes ALL refresh tokens for user
 */
export async function logoutAllController(req: Request, res: Response) {
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: AUTH_ERROR_MESSAGES.UNAUTHORIZED,
    });
  }

  await logoutAllService(userId);

  return res.status(200).json({
    success: true,
    message: "Logged out from all devices",
  });
}
