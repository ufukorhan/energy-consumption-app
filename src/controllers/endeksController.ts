import e, { Request, Response } from "express";
import { EndeksService } from "../services/endeksServices";

export const addEndeks = async (req: Request, res: Response) => {
  const endeksService = new EndeksService();

  try {
    const { value, date } = req.body;
    const userId = req.user?.id;

    if (!userId || !value || !date) {
      return res.status(400).json({ message: "You must provide a value and date with this format (YYYY-MM-DD)." });
    }

    const endeksId = await endeksService.addEndeks(userId, value, date);

    return res.status(201).json({
      message: "Endeks added successfully.",
      endeksId: endeksId,
    });
  } catch (error: any) {
    console.error("Add Endeks Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAllEndeks = async (req: Request, res: Response) => {
  const endeksService = new EndeksService();

  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ message: "You must provide a user id." });
  }

  try {
    const endeks = await endeksService.getAllEndeks(userId);
    return res.status(200).json(endeks);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const deleteEndeks = async (req: Request, res: Response) => {
  const endeksService = new EndeksService();

  try {
    const userId = req.user?.id; 
    const endeksIdToDelete = req.body.endeksId;

    if (!userId){
      return res.status(400).json({ message: "You must provide a user id." });
    }

    if (!endeksIdToDelete){
      return res.status(400).json({ message: "You must provide a endeksId." });
    }

    await endeksService.deleteEndeks(userId, endeksIdToDelete);

    res.status(200).json({ message: 'Endeks successfully deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
