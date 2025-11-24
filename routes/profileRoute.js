import express from "express";
import { getProfile } from "../controllers/userController.js";
import checkAuth from "../middleware/checkAuth.js";
import upload from "../middlewares/fileUpload.js";

const profileRouter = express.Router();

profileRouter.get("/profile", checkAuth, getProfile);
profileRouter.put("/profile/image", checkAuth, upload.single("image"), updateProfileImage);

export default profileRouter;
