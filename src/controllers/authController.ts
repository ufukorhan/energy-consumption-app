import { Request, Response } from "express";
import { authService } from "../services/authService";
import validator from "validator";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const authResult = await authService.loginUser(email, password);

    if (!authResult || !authResult.userId || !authResult.token) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    return res.status(200).json({
      message: "Successfully logged in",
      userId: authResult.userId,
      token: authResult.token,
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

export const register = async (req: Request, res: Response) => {
    try {
      const { email, password, companyName } = req.body;
        
      if (!email || !password || !companyName) {
        return res.status(400).json({ message: "You have to insert email, password and companyName fields." });
      }

      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "You have to insert a valid email." });
      }
  
      const authResult = await authService.registerUser(email, password, companyName);
  
      if (!authResult || !authResult.userId) {
        return res.status(500).json({ message: "An error occurred while creating the user." });
      }
  
      return res.status(201).json({
        message: "User created successfully.",
        userId: authResult.userId,
      });
    } catch (error) {
        console.error("Register Error:", error);

        if ((error as Error).message === "This email already exists.") {
            return res.status(400).json({ message: (error as Error).message });
        }
    
        return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  export const logout = async (req: Request, res: Response) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      const userId = req.user?.id; 

      if (!token || !userId) {
        return res.status(400).json({ message: "Token and user id are required." });
      }  
      const result = await authService.logoutUser(token , userId);
    
      return res.status(200).json({ message: result.message });

    } catch (error) {
      console.error("Logout Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  export const profile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const userEmail = req.user?.email;

        if (!userId || !userEmail) {
            throw new Error("User information could not be found");
        }

        return res.status(200).json({
            userId,
            userEmail,
        });
    } catch (error) {
        console.error("Protected Route Error:", error);
        return res.status(401).json({ message: "Could not access user information" });
    }
};

