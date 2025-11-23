import express from "express";
import { getProfile } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const profileRouter = express.Router();

profileRouter.get("/profile", authMiddleware, getProfile);
profileRouter.put("/profile/image", checkAuth, upload.single("image"), updateProfileImage);

export default router;
