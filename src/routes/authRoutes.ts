import express from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { login, logout, register, profile } from "../controllers/authController";
import { addEndeks, deleteEndeks, getAllEndeks } from "../controllers/endeksController";
import { getAllConsumptions } from "../controllers/consumptionsController";


const router = express.Router();

const AUTH_PATH = "/auth";
const USER_PATH = "/users";


router.post(AUTH_PATH + "/login", login);
router.post(AUTH_PATH + "/register", register);
router.post(AUTH_PATH + "/logout",authenticateToken, logout);
router.get(USER_PATH + "/profile", authenticateToken, profile)
router.post(USER_PATH + "/add-endeks",authenticateToken, addEndeks);
router.post(USER_PATH + "/delete-endeks",authenticateToken, deleteEndeks);
router.get(USER_PATH + "/endekses", authenticateToken, getAllEndeks);
router.get(USER_PATH + "/consumptions", authenticateToken, getAllConsumptions);





export default router;