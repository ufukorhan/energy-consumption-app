import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../entities/User";
import { AppDataSource } from "../../config/db";
import { Blacklist } from "../entities/Blacklist";

dotenv.config();

const saltRounds = 10;
const secretKey = process.env.TOKEN_SECRET || "secret";

export const authService = {
  loginUser: async (email: string, password: string) => {

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password || ""))) {
      return null;
    }
    
    return {
      userId: user.id,
      token: jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" }),
    };
  },

  registerUser: async (email: string, password: string, companyName: string) => {
    try {
      const userRepository = AppDataSource.getRepository(User);

      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new Error("This email already exists.");
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = userRepository.create({
        email,
        password: hashedPassword,
        companyName,
      });

      const createdUser = await userRepository.save(newUser);

      delete createdUser.password;

      return {
        "message": "User created successfully.",
        userId: createdUser.id,
      };
    } catch (error) {
      throw error;
    }
  },
  
  logoutUser: async (token: string, userId: number) => {
    try {
      const blacklistRepository = AppDataSource.getRepository(Blacklist);
      const existingToken = await blacklistRepository.findOne({ where: { token } });
 
      if (!existingToken) {
        await blacklistRepository.save({ token, userId });
      }

      return { message: "You have successfully logged out."};
    } catch (error) {
      throw error;
    }
  },

  verifyToken: async (token: string): Promise<{ userId: number; email: string } | null> => {
    try {
        const decoded = jwt.verify(token, secretKey) as { userId: number };
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: decoded.userId } });

        if (!user) {
            return null;
        }

        return { userId: user.id, email: user.email as string };
    } catch (error) {
        return null;
    }
},
};
