import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import User from "../../Model/UserModel.js";
import Tempmobile from "../../Model/Tempmobile.js"
import { createWallet } from "../../Services/walletService.js";

export const register = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), message: 'Error', status: false });
  }

  try {
    const { name, email, mobile, password, gender, usedRefrel, otp } = req.body;

    if(!otp) {
      return res.json({ message: "Please Send Correct OTP!", status: false });
    }

    const registeredOtp = await Tempmobile.findOne({ mobile: mobile });

    if(!registeredOtp) {
      return res.json({ message: "Please Send Correct OTP!", status: false });
    }

    if(registeredOtp && registeredOtp.otp !== otp) {
      return res.json({ message: "Please Send Correct OTP!", status: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      mobile,
      gender,
      usedRefrel,
      password: hashedPassword,
    });
    
    await newUser.save();

    await Tempmobile.deleteOne({ mobile: mobile });

    await createWallet(newUser._id, 0);

    res.json({ message: "Registration successful", status: true });

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Registration failed", error: err, status: false });
  }
}

export const cordinatorRegister = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), message: 'Error', status: false });
  }

  try {
    const { name, email, mobile, password, gender, address } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      mobile,
      address,
      gender,
      role: "CORDINATOR",
      password: hashedPassword,
    });
    await newUser.save();


    res.json({ message: "Registration successful", status: true });

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Registration failed", error: err, status: false });
  }
}

export const editCordinator = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), message: 'Error', status: false });
  }

  const id = req.params.id

  try {
    const { name, mobile, gender, address } = req.body;

    await User.findByIdAndUpdate(id, {
      name, mobile, gender, address
    })


    res.json({ message: "Updated successful", status: true });

  } catch (err) {

    res.status(500).json({ message: "Registration failed", error: err, status: false });
  }
}

// module.exports = {
//   cordinatorRegister,
//   editCordinator
// }