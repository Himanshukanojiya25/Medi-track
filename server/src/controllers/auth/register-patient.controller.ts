import { Request, Response } from "express";
import { registerPatientService } from "../../services/auth/register-patient.service";
import { asyncHandler } from "../../utils/async/async-handler.util";

/**
 * POST /auth/register/patient
 */
export const registerPatientController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password, phone } = req.body;

    const result = await registerPatientService({
      name,
      email,
      password,
      phone,
    });

    return res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      data: result,
    });
  }
);
