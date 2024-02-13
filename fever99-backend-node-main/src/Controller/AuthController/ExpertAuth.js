import User from "../../Model/UserModel.js";
import { createWallet } from "../../Services/walletService.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { generateReferralCode } from "../../Services/refrealService.js";
import { createUserExtraDetails, updateUserExtraDetailsByUserId, getUserExtraDetailsByUserId } from '../../Services/userExtraDetailsService.js'


export const Register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), message: 'Error', status: false });
  }

  try {
    let image = req.image
    const {
      name,
      email,
      mobile,
      password,
      gender,
      address,
      state,
      city,

      whatsappNumber,
      dob,
      clinicName,
      experience,
      qualification,
      profession,

    } = req.body;
    const refrealCode = await generateReferralCode();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      mobile,
      refrelCode: refrealCode,
      role: 'FRANCHISE',
      gender,
      address,
      state,
      city,
      image,
      password: hashedPassword,
    });
    let createdUser = await newUser.save();

    let panNumber = req.pan
    let aadharNumber = req.aadhar_card
    let licence = req.licence

    await createUserExtraDetails({
      userId: createdUser._id,
      dob,
      degree: qualification,
      licence,
      totalExperience: experience,
      clinicName,
      whatsappNumber,
      panNumber,
      aadharNumber,
      profession: JSON.parse(profession)
    })

    await createWallet(newUser._id, 0);

    res.json({ message: "Franchise has successfully been added!", status: true });

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Registration failed", error: err, status: false });
  }
};


export const updateFranchise = async (req, res) => {
  try {
    let image = req.image
    const id = req.params.id
    const {
      name,
      mobile,
      password,
      gender,
      address,
      state,
      city,
      whatsappNumber,
      dob,
      clinicName,
      experience,
      qualification,
      profession,
    } = req.body;


    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate(id, {
        name,
        mobile,
        gender,
        address,
        state,
        city,
        image,
        password: hashedPassword,
      })
    } else {
      await User.findByIdAndUpdate(id, {
        name,
        mobile,
        gender,
        address,
        state,
        city,
        image
      })
    }

    let panNumber = req.pan
    let aadharNumber = req.aadhar_card
    let licence = req.licence

    await updateUserExtraDetailsByUserId(id, {
      dob,
      degree: qualification,
      licence,
      totalExperience: experience,
      clinicName,
      whatsappNumber,
      panNumber,
      aadharNumber,
      profession: JSON.parse(profession)
    })


    res.json({ message: "Franchise has successfully been Updated!", status: true });

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Registration failed", error: err, status: false });
  }
}

export const getFranchiseById = async (req, res) => {
  const id = req.params.id
  try {
    const user = await User.findById(id);

    const extraDetails = await getUserExtraDetailsByUserId(id)

    res.json({ status: true, message: 'single Franchise ', data: user, extraDetails: extraDetails })
  } catch (error) {

  }


}