import { AppDataSource } from "../../config/db";
import { Endeks } from "../entities/Endeks";
import { Consumption } from "../entities/Consumption";
import { User } from "../entities/User";

export class EndeksService {
  private endeksRepository = AppDataSource.getRepository(Endeks);
  private consumptionRepository = AppDataSource.getRepository(Consumption);
  private userRepository = AppDataSource.getRepository(User);

  async getAllEndeks(userId: number) {
    return this.endeksRepository.find({ where: { user: { id: userId } } });
  }

async deleteEndeks(userId: number, endeksId: number) {
  try {
    const endeks = await this.endeksRepository.findOne({ where: { id: endeksId, user: { id: userId } } });

    if (!endeks) {
      throw new Error("Endeks not found");
    }
    // TODO Recalculate consumption entries after deleting an endeks
    await this.endeksRepository.delete({ id: endeksId });
  } catch (error) {
    throw error;
  }
}

  async addEndeks(userId: number, value: number, date: Date): Promise<number> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new Error("User not found");
      }

      if (value < 0) {
        throw new Error("Value must be positive");
      }

      const endeks = await this.endeksRepository.findOne({ where: { user: { id: userId } }, order: { date: "DESC" } });
      if (endeks && endeks.value > value || endeks && endeks.value === value) {
        throw new Error("Value must be greater than the previous one");
      }

      const newEndeks = this.endeksRepository.create({
        user,
        value,
        date: new Date(date),
      });

      const previousEndeks = await this.endeksRepository.findOne({
        where: { user: { id: user.id } },
        order: { date: "DESC" },
      });

      const addedEndeks = await this.endeksRepository.save(newEndeks);
      if (previousEndeks) {
        const previousEndeksDate = new Date(previousEndeks.date);

        const dateDifference = Math.abs((addedEndeks.date.getTime() - previousEndeksDate.getTime()) / (1000 * 60 * 60 * 24));
        const consumptionValue = addedEndeks.value - previousEndeks.value;
        const consumptionPerDay = consumptionValue / dateDifference;

        // TODO: Add consumption entries for each day
        if (dateDifference > 1) {
          for (let i = 1; i <= dateDifference; i++) {
            const newConsumption = this.consumptionRepository.create({
              user,
              value: consumptionPerDay,
              date: new Date(previousEndeksDate.getTime() + (i * 1000 * 60 * 60 * 24)),
            });
            await this.consumptionRepository.save(newConsumption);
          }
        } else {
          const newConsumption = this.consumptionRepository.create({
            user,
            value: consumptionValue,
            date: new Date(date),
          });
          await this.consumptionRepository.save(newConsumption);
        }
      }

      return addedEndeks.id;
    } catch (error) {
      throw error;
    }
  }
}