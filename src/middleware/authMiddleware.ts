import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../config/db";
import { User } from "../entities/User";
import { Blacklist } from "../entities/Blacklist";

const secretKey = process.env.TOKEN_SECRET || "secret";

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Token missing or invalid" });
    }

    const blacklistRepository = AppDataSource.getRepository(Blacklist);
    const isBlacklisted = await blacklistRepository.findOne({ where: { token } });

    if (isBlacklisted) {
      return res.status(401).json({ message: "Invalid token" });
    }
  
    try {
      const decoded = jwt.verify(token, secretKey) as { userId: number };
  
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: decoded.userId },
      });
  
      if (!user) {
        return res.status(401).json({ message: "No user connected to the token was found" });
      }
  
      req.user = user;
      next();
    } catch (error) {
      console.error("Token Verification Error:", error);
      return res.status(401).json({ message: "Invalid token." });
    }
  };

  
