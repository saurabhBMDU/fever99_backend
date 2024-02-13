import User from "../../Model/UserModel.js";
import { createWallet } from "../../Services/walletService.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { createUserExtraDetails } from '../../Services/userExtraDetailsService.js'


export const Register = async (req, res) => {
  const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array(), message:'Error', status: false });
  // }

  try {
    const { name, email, mobile, password, gender, specialization, serviceCharge, address, serviceChargepatient,
      degree,
      languageKnown,
      dob,
      registrationNumber,
      totalExperience,
      city,
      currentOrganization,
      whatsappNumber,
      panNumber,
      userAvaliableForonPatient,
      userAvaliableForFranchise,
      aadharNumber } = req.body;

    let image = req.image

    console.log(req.body)

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      mobile,
      gender,
      specialization,
      serviceCharge,
      serviceChargepatient,
      userAvaliableForonPatient,
      userAvaliableForFranchise,
      address,
      city,
      languageKnown,
      image,
      role: 'DOCTOR',
      password: hashedPassword,
    });
    const user = await newUser.save();

    let mou = req.mou
    // let aadharFile = req.aadharFile
    // let panFile = req.panFile

    await createUserExtraDetails({
      userId: user._id,
      degree,
      dob,
      registrationNumber,
      totalExperience,
      currentOrganization,
      whatsappNumber,
      panNumber,
      aadharNumber,
      mou
    })

    await createWallet(newUser._id, 0);

    res.json({ message: "Registration successful", status: true });

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Registration failed", error: err, status: false });
  }
};
