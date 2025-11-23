import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/httpError.js";
import { validationResult } from "express-validator";


// REGISTER
export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return next(new HttpError("Invalid data inputs passed", 400));
    } else {
      const { name, email, password, phone } = req.body;
  
      const user = await User.findOne({ email });
  
      if (user) {
        return next(new HttpError("User already exists", 403));
      }
      const count = await User.countDocuments();
      const assignedRole = count === 0 ? "admin" : "customer";
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        phone,
        password: hashedPassword,
        role: assignedRole
      });
  
      await newUser.save();
  
      // GENERATE TOKEN
      const token = jwt.sign(
        {
          user_id: newUser._id,
          user_email: newUser.email,
          user_role: newUser.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_TOKEN_EXPIRY }
      );   
       
      return res.status(201).json({
        status: true,
        message: "Registered successfully!",
        role: newUser.role,
        data: newUser,
        accessToken: token
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Error creating user",
      error: err.message
    }); 
  }
};



// LOGIN

export const login = async (req, res, next) => {
  try {
    const errors= validationResult(req);
    if(!errors.isEmpty()){
      return next(new HttpError("Invalid data inputs passed", 400));
    } else {

    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .select("_id email name password role");

    if (!user) {
      return next(new HttpError("Invalid Email", 400));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new HttpError("Invalid Password", 400));
    }

    const token = jwt.sign(
      {
        user_id: user._id,
        user_email: user.email,
        user_role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRY }
    );

    return res.status(200).json({
      status: true,
      message: "Login successful",
      data: user,
      accessToken: token
    });
  }

  } catch (err) {
    console.error(err);
    next(err); 
  }
};

