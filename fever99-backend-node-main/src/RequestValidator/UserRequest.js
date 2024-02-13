import { body } from "express-validator";
import User from '../Model/UserModel.js'
export const UserRequest = [
  body("name").notEmpty().withMessage("Name is required"),
  body("mobile").notEmpty().withMessage("Name is required"),
  body("password").notEmpty().withMessage("Name is required"),
  body("gender").notEmpty().withMessage("Gender is required"),
  body("email").isEmail().withMessage("Invalid email").custom(async (value) => {
    // Check if the email is already registered in the database
    const user = await User.findOne({ email: value });
    if (user) {
      return Promise.reject('Email already in use');
    }
    return true;
  }),
];

export const UserLoginRequest = [
  body("email").notEmpty().withMessage("Email Or Mobile is required"),
  body("password").notEmpty().withMessage("Password is required"),
];