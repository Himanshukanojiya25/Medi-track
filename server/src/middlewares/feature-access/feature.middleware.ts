import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { FeatureAccessService, FEATURES } from "../../services/feature-access/feature-access.service";

/**
 * Middleware to protect routes based on subscription feature access
 */
export const requireFeature =
  (feature: FEATURES) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const hospitalId = req.user?.hospitalId;

      if (!hospitalId) {
        res.status(401).json({
          success: false,
          message: "Hospital context missing",
        });
        return;
      }

      await FeatureAccessService.assertAccess(
        new Types.ObjectId(hospitalId),
        feature
      );

      next();
    } catch (error) {
      res.status(403).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Feature access denied",
      });
    }
  };
