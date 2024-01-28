import { Request, Response } from "express";
import { ConsumptionService } from "../services/ConsumptionService";

export const getAllConsumptions = async (req: Request, res: Response) => {
    const consumptionService = new ConsumptionService();
  
    const userId = req.user?.id;
  
    if (!userId) {
      return res.status(400).json({ message: "You must provide a user id." });
    }
  
    try {
      const endeks = await consumptionService.getAllConsumptions(userId);
      return res.status(200).json(endeks);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }