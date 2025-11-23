// controllers/userController.js
import User from "../model/user.js";

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userData.userId).select("-password");
    res.json({ status: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const updateProfileImage = async (req, res, next) => {
  try {
    const imagePath = req.file ? req.file.path : "uploads/profile-default.png";

    const user = await User.findByIdAndUpdate(
      req.userData.userId,
      { image: imagePath },
      { new: true }
    ).select("-password");

    res.json({
      status: true,
      message: "Profile image updated",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
