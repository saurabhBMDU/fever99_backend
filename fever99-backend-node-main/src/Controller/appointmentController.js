import Appointment from "../Model/appointmentModel.js";
import User from "../Model/UserModel.js";
import { updateWalletByUserId } from "../Services/walletService.js";
import { AddAppointmentHistory } from '../Services/appointmentHistory.js'
import Prescription from '../Model/Prescription.js'
import { createNotification } from '../Services/notificationService.js'
import UserFcmToken from '../Model/UserFcmTokensModel.js'
import { fcmMulticastNotify, fcmNotify } from "../helpers/fcmNotify.js";
import moment from 'moment';
// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const {
      expertId,
      doctorId,
      dateTime,
      patientName,
      age,
      bodyTemperature,
      bp,
      files,
      gender,
      oxigne,
      pulse,
      suger1,
      suger2,
      suger3,
      selectedTimeSlot,
      paymentMode,
      mode
    } = req.body;

    const validateApt = await Appointment.findOne({
      paymentStatus: 'Paid',
      dateTime: dateTime,  
      selectedTimeSlot: selectedTimeSlot,  
      doctor: doctorId,
    });

    if(validateApt) {      
      res.status(200).json({ message: "This slot is already booked! Please select another slot.", status: false });
      return false
    }    

    const role = req.role

    const doctor = await User.findById(doctorId);
    if (role === 'FRANCHISE' && doctor.serviceCharge && paymentMode === 'Online') {
      await updateWalletByUserId(
        expertId,
        doctor.serviceCharge,
        "debit",
        `Debited to booked appointment to ${patientName} with ${doctor.name}`
      );
      await updateWalletByUserId(
        process.env.ADMIN_ID,
        doctor.serviceCharge,
        "credit",
        "Credited to book appointment!"
      );
    }
    let serviceCharge = 0
    if(role == 'FRANCHISE') {
      serviceCharge = doctor.serviceCharge
    }else {
      serviceCharge = doctor.serviceChargepatient
    }

    const appointment = new Appointment({
      expert: expertId,
      doctor: doctorId,
      dateTime: dateTime,
      patientName: patientName,
      age: age,
      bodyTemperature: bodyTemperature,
      bp: bp,
      mode,
      appointmentCharge: serviceCharge,
      serviceChargepatient: serviceCharge,
      paymentMode,
      files: files,
      gender: gender,
      oxigne: oxigne,
      pulse: pulse,
      suger1: suger1,
      suger2: suger2,
      suger3: suger3,
      selectedTimeSlot,
    });
    const savedApt = await appointment.save();

    const doctorTokenObj = await UserFcmToken.find({ userId: doctor._id})

    if(doctorTokenObj) {
        let notificationObj = {
          tokens: [...doctorTokenObj.map((el) => el?.token)],
          data: {
            title:"New Appointment!",
            description:"You have a new appointment",
            otherData: "hide",
            appointmentId: `${savedApt._id}`,
          },
        };
        await fcmMulticastNotify(notificationObj);
    }

    console.log('dateTime', dateTime)



    await AddAppointmentHistory(savedApt._id, expertId, doctorId, `Appointment created with ${doctor.name} at ${dateTime} ${selectedTimeSlot}`)

      await createNotification({ title: 'Appointment Created', message: `Your Appointment has been scheduled with ${doctor.name} at ${moment(dateTime).format('DD-MM-YYYY')} ${selectedTimeSlot}`, userId: expertId });
      await createNotification({ title: 'Appointment Scheduled', message: `New Appointment Request with ${patientName} has been raised at ${moment(dateTime).format('DD-MM-YYYY')} ${selectedTimeSlot} kindly Confirm.`, userId: doctorId });
    

    res.json({
      // message: "Appointment Request has been created successfully",
      message: "",
      appointment: savedApt,
      amount: doctor.serviceCharge,
      status: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
};



export const getAllAppointments = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const fromDate = req.query.fromDate || "";
  const toDate = req.query.toDate || "";
  const role = req.role

  // console.log(role)

  const dateFilter = {paymentStatus: 'Paid'};

  if (fromDate && toDate) {
    dateFilter.createdAt = {
      $gte: new Date(fromDate),
      $lte: new Date(toDate),
    };
  } else if (fromDate) {
    dateFilter.createdAt = { $gte: new Date(fromDate) };
  } else if (toDate) {
    dateFilter.createdAt = { $lte: new Date(toDate) };
  }


  try {
    const totalCount = await Appointment.countDocuments(dateFilter);
    const appointments = await Appointment.find(dateFilter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("doctor expert");
    res.json({
      data: appointments,
      totalCount: totalCount,
      status: true,
      message: "Appointment list",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Failed to fetch appointments", status: false });
  }
};


export const getAppointmentById = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById(appointmentId).populate("doctor");

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found", status: false });
    }

    // Lookup prescription by appointment ID
    const prescription = await Prescription.find({ appointmentId: appointmentId });

    // Combine appointment and prescription data
    const appointmentWithPrescription = {
      ...appointment.toObject(),
      prescription: prescription,
    };

    res.json({ message: "Appointment with Prescription", status: true, data: appointmentWithPrescription });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointment", status: false });
  }
};


// Get an appointment by Doctor ID
export const getAppointmentByDoctorId = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Page number
  const limit = parseInt(req.query.limit) || 10;
  try {
    const doctorId = req.params.id;
    const appointment = await Appointment.find({ doctor: doctorId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("doctor expert");
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json({ message: "All Apointment", status: true, data: appointment });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
};

// Get an appointment by Expert ID
export const getAppointmentByUserId = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const fromDate = req.query.fromDate || "";
  const toDate = req.query.toDate || "";
  const status = req.query.status || "";
  const userId = req.user;
  const role = req.role;

  const dateFilter = {paymentStatus: 'Paid'};

  if (fromDate && toDate) {
    // If both fromDate and toDate are provided, create a date range filter
    dateFilter.createdAt = {
      $gte: new Date(fromDate),
      $lte: new Date(toDate),
    };
  }

  try {
    let appointment = [];

    let query = { ...dateFilter };

    if (status !== "") {
      query.status = status;
    }

    if (role === "DOCTOR") {
      query.doctor = userId;
    } else if (role === "FRANCHISE" || role === "PATIENT") {
      query.expert = userId;
    }
    const totalAppointments = await Appointment.countDocuments(query);

    appointment = await Appointment.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("doctor expert");

    res.json({ message: "All Appointments", status: true, data: appointment, totalAppointments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};




export const updateAppointmentCallStatus = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { callInprogress } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      req.body
    );
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json({
      message: "Appointment status updated successfully",
      appointment,
      status: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update appointment status", status: true });
  }
};

// Update an appointment status by ID
export const updateAppointmentStatus = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      req.body
    );
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if(status === 'confirmed') {

      // await createNotification({ title: 'Appointment Created', message: `Your Appointment has schedule with ${doctor.name} at ${dateTime} ${selectedTimeSlot}`, userId: expertId });
      // await createNotification({ title: 'Appointment Scheduled', message: `Your Appointment with ${doctor.name} has been scheduled at ${dateTime} ${selectedTimeSlot}`, userId: doctorId });


      const apt = await Appointment.findById(appointmentId);
      const doctorTokenObj = await UserFcmToken.find({ userId: apt.expert})
      if(doctorTokenObj) {
        let notificationObj = {
          tokens: [...doctorTokenObj.map((el) => el?.token)],
          data: {
            title:"Appointment Accepted!",
            description:"Your appointment has been accepted.",
            otherData: "hide",
            appointmentId: `${appointmentId}`,
          },
        };
        await fcmMulticastNotify(notificationObj);
      }
      
    }

    res.json({
      message: "Appointment status updated successfully",
      appointment,
      status: true,
    });
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ error: "Failed to update appointment status", status: true });
  }
};

// Delete an appointment by ID
export const deleteAppointmentById = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findByIdAndDelete(appointmentId);
    if (!appointment) {
      return res
        .status(404)
        .json({ error: "Appointment not found", status: false });
    }
    res.json({ message: "Appointment deleted successfully", status: true });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete appointment", status: false });
  }
};

export const updateAppointmentHistory = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user;
    const { message, toId, type } = req.body;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new Error("Appointment Not Found!");
    }

    appointment.addHistory(message, userId, toId, type);

    res.json({ status: true, message: "loged" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add history", status: false });
  }
};


export const createFlowwUp = async (req, res) => {
  try {
    const { date, timeSlot, followUpDetails } = req.body;
    const appointmentId = req.params.id;

    const appointment = await Appointment.findById(appointmentId);
    appointment.selectedTimeSlot = timeSlot;
    appointment.dateTime = date;
    appointment.status = 'Follow-up';

    await appointment.save();

    await AddAppointmentHistory(appointment._id, appointment.expert, appointment.doctor, `Follow-up Scheduled at ${date} ${timeSlot}`)

    res.json({ status: true, message: "Follow-up Scheduled" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create appointment follow-up schedule' });
  }
};

