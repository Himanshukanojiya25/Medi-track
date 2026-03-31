import { Request, Response } from "express";
import { PublicAIService } from "../../services/public";
import { aiSymptomBodySchema } from "../../validations/public";

export class PublicAIController {
  static async analyzeSymptoms(req: Request, res: Response) {
    try {
      const body = aiSymptomBodySchema.parse(req.body);
      const result = await PublicAIService.analyzeSymptoms(body);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}