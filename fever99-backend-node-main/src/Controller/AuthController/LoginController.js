import { validationResult } from "express-validator";
import User from "../../Model/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

function isEmail(input) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
}

function isMobileNumber(input) {
  // Assuming a simple check for digits and optional '+' at the start
  const mobileRegex = /^(\+\d{1,})?\d{10}$/;
  return mobileRegex.test(input);
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(200)
        .json({ errors: errors.array(), message: "Error", status: false });
    }

    let user;

    if (isEmail(email)) {
      user = await User.findOne({ email: email });
    } else if (isMobileNumber(email)) {
      user = await User.findOne({ mobile: email });
    } else {
      return res.status(200).json({ error: "Invalid email or mobile number", status: false });
    }

    if (!user) {
      return res.status(200).json({ error: "User not found", status: false });
    }

    if (!user) {
      return res
        .status(200)
        .json({ error: "Invalid credentials", status: false, message: 'error' });
    }

    if (user.status === 'inactive') {
      return res
        .status(200)
        .json({ error: "Invalid credentials", status: false, message: 'error' });
    }

    // Compare the password provided with the hashed password in the database using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({ error: "Invalid credentials", status: false, message: 'Error' });
    }

    // If the password matches, generate a JWT token and send it in the response
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECREAT_KEY, {
      expiresIn: "72h",
    });
    res.json({ user: user, token: token, message: 'Login Success!', status: true });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Login failed" });
  }
};
