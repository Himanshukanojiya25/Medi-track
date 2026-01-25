import { Request, Response, NextFunction } from "express";

import { loginService } from "../../services/auth/auth.service";
import { refreshTokenService } from "../../services/auth/refresh-token.service";
import {
  logoutService,
  logoutAllService,
} from "../../services/auth/logout.service";
import { AUTH_ERROR_MESSAGES } from "../../constants/auth";

/**
 * =========================
 * 🔐 LOGIN CONTROLLER
 * =========================
 */
export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const result = await loginService(req.body);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    // ❗ IMPORTANT:
    // Forward error to global error handler
    next(error);
  }
}

/**
 * =========================
 * 🔁 REFRESH TOKEN CONTROLLER
 * =========================
 */
export async function refreshTokenController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: AUTH_ERROR_MESSAGES.TOKEN_MISSING,
      });
    }

    const tokens = await refreshTokenService(refreshToken);

    return res.status(200).json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * =========================
 * 🔓 LOGOUT (SINGLE DEVICE)
 * =========================
 */
export async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
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
  } catch (error) {
    next(error);
  }
}

/**
 * =========================
 * 🔓 LOGOUT (ALL DEVICES)
 * =========================
 */
export async function logoutAllController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
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
  } catch (error) {
    next(error);
  }
}
