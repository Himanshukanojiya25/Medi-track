import { Request, Response } from "express";
import { PublicSearchService } from "../../services/public";
import { searchQuerySchema } from "../../validations/public";

export class PublicSearchController {
  static async search(req: Request, res: Response) {
    try {
      const query = searchQuerySchema.parse(req.query);
      const result = await PublicSearchService.search({
        query: query.q,
        location: query.location,
        speciality: query.speciality,
        page: query.page,
        limit: query.limit,
      });
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}