import { AppDataSource } from "../../config/db";
import { Consumption } from "../entities/Consumption";

export class ConsumptionService {
  private consumptionRepository = AppDataSource.getRepository(Consumption);

  async getAllConsumptions(userId: number) {
    return this.consumptionRepository.find({ where: { user: { id: userId } } });
  }
}