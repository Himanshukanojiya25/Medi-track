import { Request, Response } from "express";
import { DoctorProfileService } from "../../services/doctor-profile/doctor-profile.service";

export class DoctorProfileController {
  /**
   * Get complete doctor profile
   */
  static async getProfile(req: Request, res: Response) {
    try {
      const { doctorId } = req.params;
      
      const profile = await DoctorProfileService.getCompleteProfile(doctorId);
      
      return res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      console.error("Error in getProfile:", error);
      
      if (error.message === "Doctor not found") {
        return res.status(404).json({
          success: false,
          message: "Doctor not found",
        });
      }
      
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get basic doctor information
   */
  static async getBasicInfo(req: Request, res: Response) {
    try {
      const { doctorId } = req.params;
      
      const basicInfo = await DoctorProfileService.getBasicInfo(doctorId);
      
      return res.status(200).json({
        success: true,
        data: basicInfo,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get doctor specializations
   */
  static async getSpecializations(req: Request, res: Response) {
    try {
      const { doctorId } = req.params;
      
      const specializations = await DoctorProfileService.getSpecializations(doctorId);
      
      return res.status(200).json({
        success: true,
        data: specializations,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get doctor qualifications
   */
  static async getQualifications(req: Request, res: Response) {
    try {
      const { doctorId } = req.params;
      
      const qualifications = await DoctorProfileService.getQualifications(doctorId);
      
      return res.status(200).json({
        success: true,
        data: qualifications,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get doctor availability
   */
  static async getAvailability(req: Request, res: Response) {
    try {
      const { doctorId } = req.params;
      
      const availability = await DoctorProfileService.getAvailability(doctorId);
      
      return res.status(200).json({
        success: true,
        data: availability,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get doctor reviews with pagination
   */
  static async getReviews(req: Request, res: Response) {
    try {
      const { doctorId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const reviews = await DoctorProfileService.getReviews(doctorId, page, limit);
      
      return res.status(200).json({
        success: true,
        data: reviews,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get doctor statistics
   */
  static async getStats(req: Request, res: Response) {
    try {
      const { doctorId } = req.params;
      
      const stats = await DoctorProfileService.getStats(doctorId);
      
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}