import { Request, Response } from "express";
import { loginService } from "../../services/auth/auth.service";
import { asyncHandler } from "../../utils/async/async-handler.util";

/**
 * POST /auth/login
 */
export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    // ✅ CORRECT
    const { email, password } = req.body;

    const result = await loginService({ email, password });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  }
);
