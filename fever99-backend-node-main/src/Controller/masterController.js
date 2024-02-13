import User from "../Model/UserModel.js";
import UserFcmToken from '../Model/UserFcmTokensModel.js'
import Wallet from "../Model/WalletModel.js";
import UserDeleteRequest from '../Model/UserDeleteRequest.js'
import {
  getWalletByUserId,
  getLatestTransaction,
} from "../Services/walletService.js";


import Appointment from "../Model/appointmentModel.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const today = new Date();
today.setHours(0, 0, 0, 0);

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);


export const getEarnings = async (req, res) => {
  const { fromDate, toDate, appointmentMode, paymentMode, userType } = req.query;
  const userId = req.user;
  const role = req.role;

  let fromDateStart = new Date(fromDate);
  fromDateStart.setHours(0, 0, 0, 0);

  let toDateEnd = new Date(toDate);
  toDateEnd.setHours(23, 59, 59, 999);

  // Define a filter object to use for filtering
  let filter = {
    createdAt: {
      $gte: fromDateStart,
      $lte: toDateEnd,
    },
  };

  if (appointmentMode) {
    filter.mode = appointmentMode;
  }

  if (paymentMode) {
    filter.paymentMode = paymentMode;
  }

  if (userType) {
    const usersWithRole = await User.find({ role: userType });
    const userIDs = usersWithRole.map((user) => user._id);
    filter['expert'] = { $in: userIDs };
  }

  let upcomingFilter = {
    createdAt: {
      $gte: fromDateStart,
      $lte: toDateEnd,
    },
  };

  // Define the commission rate based on the role
  let commissionRate = 0.6; // Default commission rate for DOCTOR role

  if (role === 'DOCTOR') {
    filter.doctor = userId;
    filter.status = 'completed';

    upcomingFilter.doctor = userId;
    upcomingFilter.status = { $ne: 'completed' };
  } else if (role === 'FRANCHISE') {
    filter.expert = userId;
    filter.status = 'completed';

    upcomingFilter.expert = userId;
    upcomingFilter.status = { $ne: 'completed' };
    commissionRate = 0.2; // Commission rate for FRANCHISE role
  }

  try {
    const appointments = await Appointment.find(filter)
      .select('expert patientName _id status appointmentCharge createdAt')
      .sort({ createdAt: -1 }).populate('expert');

    const upcomingAppointments = await Appointment.find(upcomingFilter)
      .select('patientName _id status appointmentCharge createdAt');

    const appointmentsWithEarnings = appointments.map(appointment => {
      const earning = appointment.appointmentCharge * commissionRate;
      return { ...appointment.toObject(), earning };
    });

    const upcomingAppointmentsWithEarnings = upcomingAppointments.map(appointment => {
      const earning = appointment.appointmentCharge * commissionRate;
      return { ...appointment.toObject(), earning };
    });

    // Calculate the total earnings
    const totalEarnings = appointmentsWithEarnings.reduce((total, appointment) => total + appointment.earning, 0);
    const totalUpcomingEarnings = upcomingAppointmentsWithEarnings.reduce((total, appointment) => total + appointment.earning, 0);

    res.json({ data: appointmentsWithEarnings, totalEarnings, totalUpcomingEarnings, status: true, message: 'Earning List' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch earnings data' });
  }
};

export const getAdminEarnings = async (req, res) => {
  const { fromDate, toDate, appointmentMode, paymentMode, userType } = req.query;
  const userId = req.user;
  const role = req.role;

  let fromDateStart = new Date(fromDate);
  fromDateStart.setHours(0, 0, 0, 0);

  let toDateEnd = new Date(toDate);
  toDateEnd.setHours(23, 59, 59, 999);

  // Define a filter object to use for filtering
  let filter = {
    createdAt: {
      $gte: fromDateStart,
      $lte: toDateEnd,
    },
  };

  if (appointmentMode) {
    filter.mode = appointmentMode;
  }

  if (paymentMode) {
    filter.paymentMode = paymentMode;
  }

  if (userType) {
    const usersWithRole = await User.find({ role: userType });
    const userIDs = usersWithRole.map((user) => user._id);
    filter['expert'] = { $in: userIDs };
  }

  // Define the commission rate based on the role
  let DoctorCommissionRate = 0.6;
  let FranchiseCommissionRate = 0.2; // Default commission rate for DOCTOR role
  let AdminCommissionRate = 0.2;



  try {
    const appointments = await Appointment.find(filter)
      .select('patientName _id status mode paymentMode appointmentCharge createdAt')
      .sort({ createdAt: -1 }).populate('expert', 'role');


    const appointmentsWithEarnings = appointments.map(appointment => {
      const doctorEarning = appointment.appointmentCharge * DoctorCommissionRate;
      const FranchiseEarning = appointment.appointmentCharge * FranchiseCommissionRate;
      const AdminEarning = appointment.appointmentCharge * AdminCommissionRate;
      return { ...appointment.toObject(), doctorEarning, FranchiseEarning, AdminEarning };
    });



    // Calculate the total earnings
    const totalEarnings = appointmentsWithEarnings.reduce((total, appointment) => total + appointment.AdminEarning, 0);
    const totalDoctorEarning = appointmentsWithEarnings.reduce((total, appointment) => total + appointment.doctorEarning, 0);
    const totalFranchiseEarning = appointmentsWithEarnings.reduce((total, appointment) => total + appointment.FranchiseEarning, 0);

    res.json({ data: appointmentsWithEarnings, totalEarnings, totalDoctorEarning, totalFranchiseEarning, status: true, message: 'Earning List' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch earnings data' });
  }
};










export const updateUserAvaliableStatus = async (req, res) => {
  const { userStatus } = req.body;
  const userId = req.user

  const user = await User.findByIdAndUpdate(userId, { userStatus });

  if (!user) {
    return res.status(404).json({ error: "Appointment not found" });
  }
  const data = await User.findById(userId);

  res.json({ status: true, message: "Status updated", data: data });

}

export const updatePinStatsStatus = async (req, res) => {
  const { pinUser } = req.body;
  const userId = req.params.id

  console.log(userId)

  const user = await User.findByIdAndUpdate(userId, { pinUser });

  if (!user) {
    return res.status(404).json({ error: "Doctor Not Found not found" });
  }
  const data = await User.findById(userId);

  res.json({ status: true, message: pinUser ? "Doctor Pined" : "Doctor Unpined", data: data });

}

export const ChangePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body

    const userId = req.user

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "You are not a valid user" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(200).json({ error: "Invalid credentials", status: false, message: 'Error' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword

    await user.save();

    return res.status(200).json({ message: "Password Changed", status: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: "error" });
  }

}

export const updateUser = async (req, res) => {
  const { timeSlot, timeSlotoffline } = req.body;

  console.log(timeSlotoffline)
  const userId = req.user;
  try {
    const user = await User.findByIdAndUpdate(userId, { timeSlot: timeSlot, timeSlotoffline: timeSlotoffline });

    if (!user) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    const data = await User.findById(userId);
    res.json({ status: true, message: "Slot Updated!", data: data });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: "error" });
  }
};

export const userActivateDeactivateById = async (req, res) => {
  const id = req.params.id;

  const { status } = req.body

  const user = await User.findByIdAndUpdate(id, { status });

  if (!user) {
    res.status(400).json({ status: false, message: "error" });
  }

  return res.json({ status: true, message: 'User Status Updated!' })


}

export const usersList = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const query = req.query.filter || '';
  const state = req.query.state || '';
  const city = req.query.city || '';
  const userId = req.user;
  const { role } = req.params;
  try {
    const sortOptions = { createdAt: -1 };

    let aggregatePipeline = [
      { $match: { role: role } },
    ];

    if (query) {
      // Add a $match stage to filter by name if the query parameter is provided
      aggregatePipeline.push({
        $match: {
          name: { $regex: query, $options: 'i' },
        }
      });
    }

    if (state) {
      // Add a $match stage to filter by name if the query parameter is provided
      aggregatePipeline.push({
        $match: {
          state: { $regex: state, $options: 'i' },
        }
      });
    }
    if (city) {
      // Add a $match stage to filter by name if the query parameter is provided
      aggregatePipeline.push({
        $match: {
          city: { $regex: city, $options: 'i' },
        }
      });
    }

    aggregatePipeline.push(
      { $sort: sortOptions },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    );

    if (role === 'DOCTOR' || role === 'FRANCHISE') {
      aggregatePipeline.push({
        $lookup: {
          from: 'userextradetails',
          localField: '_id',
          foreignField: 'userId',
          as: 'userExtraDetails'
        }
      });
      aggregatePipeline.push({
        $addFields: {
          userExtraDetails: { $arrayElemAt: ['$userExtraDetails', 0] }
        }
      });
    }

    // Perform the aggregation
    const users = await User.aggregate(aggregatePipeline);


    let countFilter = { role: role };

    if (query) {
      countFilter.name = { $regex: query, $options: 'i' }
    }

    if (state) {
      countFilter.state = { $regex: state, $options: 'i' }
    }
    if (city) {
      countFilter.city = { $regex: city, $options: 'i' }
    }

    const totalRecord = await User.countDocuments(countFilter);

    res.json({
      status: true,
      message: "User List",
      data: users,
      totalRecord: totalRecord
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: "error" });
  }
};


export const uploadFiles = async (req, res) => {
  const filename = await req.filename;

  if (filename) {
    res.json({ status: true, message: "file Uploaded", data: filename });
  } else {
    res.json({
      status: false,
      message: "Something went wrong please try again!",
      data: filename,
    });
  }
};


export const notifyUsersForMeetingCreation = async (req, res, next) => {
    try {

        console.log(req.body)
        let appointmentObj = await Appointment.findById(req.body.appointmentId).exec();
        console.log(appointmentObj, "appointmentObj", JSON.stringify(appointmentObj, null, 2))
        let arr = []

        let doctorTokenObj
        let expertTokenObj
        if (appointmentObj && appointmentObj.doctor && appointmentObj.doctor != "") {
            doctorTokenObj = await UserFcmToken.find({ userId: appointmentObj.doctor }).exec();
            if (doctorTokenObj) {
                let notificationObj = {
                    tokens: [...doctorTokenObj.map(el => el?.token)],
                    data: {
                        title: req.user == appointmentObj.doctor ? "You have created an appointment" : "Client has created an appointment",
                        description: req.user == appointmentObj.doctor ? "You have created an appointment" : "Client has created an appointment",
                    },
                };
                await fcmMulticastNotify(notificationObj);
            }
        }

        if (appointmentObj && appointmentObj.expert && appointmentObj.expert != "") {
            expertTokenObj = await UserFcmToken.find({ userId: appointmentObj.expert }).exec();
            console.log(expertTokenObj, "expertTokenObj")
            if (expertTokenObj) {
                let notificationObj = {
                    tokens: [...expertTokenObj.map(el => el?.token)],
                    data: {
                        title: req.user !== appointmentObj.doctor ? "You have created an appointment" : "Client has created an appointment",
                        description: req.user !== appointmentObj.doctor ? "You have created an appointment" : "Client has created an appointment",
                    },
                };
                await fcmMulticastNotify(notificationObj);
            }
        }

        res.status(200).json({ message: "FCM Token ", success: true });
    } catch (error) {
        console.error(error);
        next(error);
    }
};


export const DeleteUserDatas = async (req, res) => {
  const userId = req.user;
  const role = req.role;
  try {
    if(role === 'PATIENT') {

      const isExist = await UserDeleteRequest.findOne({userId});

      if( isExist) {
        return res.json({ status: true, message: 'Your request is already recored!' });
      }
      const userDelete = new UserDeleteRequest({
        userId,
        message: 'Please Delete my details'
      })

      await userDelete.save();

      // await UserFcmToken.deleteMany({ userId });

      // // Delete wallet information associated with the user
      // await Wallet.deleteOne({ user: userId });

      // // Delete appointments associated with the user
      // await Appointment.deleteMany({ expert: userId });

      // // Delete the user itself
      // await User.deleteOne({ _id: userId });
    }   

    console.log(`User data deleted for user with ID: ${userId}`);

    res.json({ status: true, message: 'User data will delete in 15 days.' });
  } catch (error) {
    console.error('Error deleting user data:', error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};



export const dashboard = async (req, res) => {
  const userId = req.user;
  const role = req.role;
  const data = {};

  if (role == "ADMIN") {
    const doctor = await User.countDocuments({ role: "DOCTOR" });
    const user = await User.countDocuments({ role: "PATIENT" });
    const Frenchise = await User.countDocuments({ role: "FRANCHISE" });
    const wallet = await getWalletByUserId(userId);
    const transaction = await getLatestTransaction(userId);
    data.doctor = doctor;
    data.user = user;
    data.franchise = Frenchise;
    data.wallet = wallet && wallet.balance;
    data.transaction = transaction;
  }
  if (role == "CORDINATOR") {
    const totalAppointment = await Appointment.countDocuments();
    const pendingAppointment = await Appointment.countDocuments({
      status: "pending",
    });
    const todayAppointment = await Appointment.countDocuments({
      status: "accepted",
      appointmentDate: {
        $gte: today,
        $lt: tomorrow,
      },
    });
    const totalCompleted = await Appointment.countDocuments({
      status: "completed",
    });

    data.totalApointment = totalAppointment;
    data.pendingAppointment = pendingAppointment;
    data.todayAppointment = todayAppointment;
    data.totalCompleted = totalCompleted
  }

  if (role == "FRANCHISE") {
    const totalAppointment = await Appointment.countDocuments({
      expert: userId,
    });
    const pendingAppointment = await Appointment.countDocuments({
      expert: userId,
      status: "pending",
    });
    const todayAppointment = await Appointment.countDocuments({
      expert: userId,
      status: "accepted",
      appointmentDate: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    const user = await User.findById(userId);
    const totalCompleted = await Appointment.countDocuments({
      expert: userId,
      status: "completed",
    });

    // New code: Total Registered Users and Total Income Monthly
    const currentYear = new Date().getFullYear();
    // const startOfMonth = new Date(currentYear, 0, 1);
    // const endOfMonth = new Date(currentYear, 12, 0);

    const monthlyData = [];
    for (let month = 1; month <= 12; month++) {
      const startOfMonth = new Date(currentYear, month - 1, 1);
      const endOfMonth = new Date(currentYear, month, 0);

      const totalAppointmentMonthly = await Appointment.countDocuments({
        expert: userId,
        createdAt: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      });

      monthlyData.push({
        x: month, // Assuming monthNames is an array of month names
        y: totalAppointmentMonthly,
      });
    }

    const monthlyIncome = [];
    for (let month = 1; month <= 12; month++) {
      const startOfMonth = new Date(currentYear, month - 1, 1);
      const endOfMonth = new Date(currentYear, month, 0);

      const totalIncomeMonthly = await Appointment.find({
        expert: userId,
        status: "completed",
        createdAt: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      });

      let totalIncome = 0

      if (totalIncomeMonthly.length > 0) {
        totalIncome = totalIncomeMonthly.reduce((sum, item) => sum + item.appointmentCharge, 0);

      }


      monthlyIncome.push({
        x: month,
        y: totalIncome,
      });
    }

    data.totalApointment = totalAppointment;
    data.pendingAppointment = pendingAppointment;
    data.todayAppointment = todayAppointment;
    data.totalAppointmentMonthly = monthlyData;
    data.totalMonthlyIncome = monthlyIncome
  }
  if (role == "DOCTOR") {
    const totalAppointment = await Appointment.countDocuments({
      doctor: userId,
    });
    const pendingAppointment = await Appointment.countDocuments({
      doctor: userId,
      status: "pending",
    });
    const todayAppointment = await Appointment.countDocuments({
      doctor: userId,
      status: "accepted",
      appointmentDate: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    const user = await User.findById(userId);
    const totalCompleted = await await Appointment.countDocuments({
      doctor: userId,
      status: "completed",
    });

    // New code: Total Registered Users and Total Income Monthly
    const currentYear = new Date().getFullYear();
    // const startOfMonth = new Date(currentYear, 0, 1);
    // const endOfMonth = new Date(currentYear, 12, 0);

    const monthlyData = [];
    for (let month = 1; month <= 12; month++) {
      const startOfMonth = new Date(currentYear, month - 1, 1);
      const endOfMonth = new Date(currentYear, month, 0);

      const totalAppointmentMonthly = await Appointment.countDocuments({
        doctor: userId,
        createdAt: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      });

      monthlyData.push({
        x: month, // Assuming monthNames is an array of month names
        y: totalAppointmentMonthly,
      });
    }

    const monthlyIncome = [];
    for (let month = 1; month <= 12; month++) {
      const startOfMonth = new Date(currentYear, month - 1, 1);
      const endOfMonth = new Date(currentYear, month, 0);

      const totalIncomeMonthly = await Appointment.find({
        doctor: userId,
        status: "completed",
        createdAt: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      });

      let totalIncome = 0

      if (totalIncomeMonthly.length > 0) {
        totalIncome = totalIncomeMonthly.reduce((sum, item) => sum + item.appointmentCharge, 0);

      }


      monthlyIncome.push({
        x: month,
        y: totalIncome,
      });
    }

    data.totalApointment = totalAppointment;
    data.pendingAppointment = pendingAppointment;
    data.todayAppointment = todayAppointment;
    data.totalEarnings = totalCompleted * user.serviceCharge;
    data.totalAppointmentMonthly = monthlyData;
    data.totalMonthlyIncome = monthlyIncome
  }

  res.json({ status: true, message: "Dashboard status", data: data });
};
