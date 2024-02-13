import { validationResult } from "express-validator";
import User from "../../Model/UserModel.js";
import Tempmobile from "../../Model/Tempmobile.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateSixDigitotp, sendForgotPassword, registerOtp } from "../../helpers/sentOpt.js";

export const requestForgotPassword = async (req, res) => {
    const {mobile} = req.body

    const user = await User.findOne({mobile: mobile})
    if(user && user.mobile) {
        const otp = await generateSixDigitotp();
        const sentRes = await sendForgotPassword(user, otp)
        if(sentRes && sentRes.statusCode === 200) {
            await User.findByIdAndUpdate(user._id, { otp: otp }, { new: true });
            res.json({
                status: true, message: 'OTP Sent Successfully!'
            })
        }
    }else {
        return res.json({status:  false, message: 'Mobile number not register with us!'})
    }

    res.json({status:  false, message: 'Something went wrong please try again!'})
}

export const tempempmobile = async (req, res) => {
    const { mobile } = req.body
    
    const user = await User.findOne({ mobile: mobile })
    if (user && user.mobile) {
        return res.json({ status: false, message: 'This Mobile is already registered with us!' })
    }

    if (mobile) {
        let tempmobile = await Tempmobile.findOne({ mobile: mobile });

        if (tempmobile) {
            // If mobile exists in Tempmobile, update the OTP
            const otp = await generateSixDigitotp();
            const sentRes = await registerOtp(mobile, otp);
            
            if (sentRes && sentRes.statusCode === 200) {
                tempmobile.otp = otp;
                await tempmobile.save();
                return res.json({
                    status: true, message: 'OTP Sent Successfully!'
                });
            }
        } else {
            // If mobile does not exist in Tempmobile, create a new entry
            const otp = await generateSixDigitotp();
            const sentRes = await registerOtp(mobile, otp);
            
            if (sentRes && sentRes.statusCode === 200) {
                tempmobile = new Tempmobile({ mobile: mobile, otp: otp });
                await tempmobile.save();
                return res.json({
                    status: true, message: 'OTP Sent Successfully!'
                });
            }
        }
    } else {
        return res.json({ status: false, message: 'Mobile required!' });
    }

    return res.json({ status: false, message: 'Something went wrong, please try again!' });
}


export const verifyAndUpdatePassword = async (req, res) => {
    const  {otp, mobile} = req.body
    const user = await User.findOne({mobile: mobile})

    if(user && user.otp === otp) {
        res.json({status: true, message:'OTP Validated!'})
    }

    res.json({status: false, message: 'OTP is not valid'})

}

export const resetPassword = async (req, res) => {
    try {
        const { otp, mobile, password, rePassword } = req.body;
        const user = await User.findOne({ mobile: mobile });

        if (user && user.otp === otp) {
            if (password === rePassword) {
                const hashedPassword = await bcrypt.hash(password, 10);

                await User.findByIdAndUpdate(user._id, { password: hashedPassword, otp: null }, { new: true });

                return res.json({ status: true, message: 'Password reset successfully' });
            } else {
                return res.json({ status: false, message: 'Password and repassword do not match' });
            }
        } else {
            return res.json({ status: false, message: 'OTP is not valid' });
        }
    } catch (error) {
        console.error('Error in resetPassword:', error);
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }

    
};