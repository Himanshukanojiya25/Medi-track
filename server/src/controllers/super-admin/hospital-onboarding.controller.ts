import { Request, Response } from 'express';
import { HospitalOnboardingService } from '../../services/super-admin/hospital-onboarding.service';
import { asyncHandler } from '../../utils/async';
import { sendResponse } from '../../utils/response';
import { HttpError } from '../../utils/response';

export class HospitalOnboardingController {
  static approve = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new HttpError('Unauthorized', 401);
    }

    const { hospitalId } = req.params;
    const result = await HospitalOnboardingService.approve(
      hospitalId,
      req.user.id
    );

    return sendResponse(res, {
      statusCode: 200,
      message: 'Hospital approved successfully',
      data: result,
    });
  });

  static reject = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new HttpError('Unauthorized', 401);
    }

    const { hospitalId } = req.params;
    const { reason } = req.body;

    const result = await HospitalOnboardingService.reject(
      hospitalId,
      req.user.id,
      reason
    );

    return sendResponse(res, {
      statusCode: 200,
      message: 'Hospital rejected successfully',
      data: result,
    });
  });

  static suspend = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new HttpError('Unauthorized', 401);
    }

    const { hospitalId } = req.params;

    const result = await HospitalOnboardingService.suspend(
      hospitalId,
      req.user.id
    );

    return sendResponse(res, {
      statusCode: 200,
      message: 'Hospital suspended successfully',
      data: result,
    });
  });
}
