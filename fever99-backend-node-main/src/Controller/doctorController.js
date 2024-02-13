import User from '../Model/UserModel.js'
import { updateUserExtraDetailsByUserId } from '../Services/userExtraDetailsService.js'
import Appointment from '../Model/appointmentModel.js'
import bcrypt from "bcrypt";

export const getDoctor = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const query = req.query.query || '';
  const city = req.query.city || '';
  const role = req.role;
  const pricesort = req.query.pricesort || null;

  try {
    const queryConditions = {
      role: 'DOCTOR',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { specialization: { $regex: query, $options: 'i' } },
      ],
    };

    if (city) {
      queryConditions.city = city;
    }

    if (role === 'PATIENT') {
      queryConditions.userAvaliableForonPatient = true;
    }
    if (role === 'FRANCHISE') {
      queryConditions.userAvaliableForFranchise = true;
    }

    let sortOptions = {
      pinUser: -1,
      createdAt: -1,
    };

    if (pricesort === 'DESC') {
      sortOptions = {}
      if (role === 'PATIENT') {
        sortOptions.serviceChargepatient = -1;
      }

      if (role === 'FRANCHISE') {
        sortOptions.serviceCharge = -1 ;
      }
    }

    if (pricesort === 'ASC') {
      sortOptions = {}
      if (role === 'PATIENT') {
        sortOptions.serviceChargepatient = 1;
      }

      if (role === 'FRANCHISE') {
        sortOptions.serviceCharge = 1 ;
      }
    }

    const count = await User.countDocuments(queryConditions);

    const totalPages = Math.ceil(count / limit);

    const Doctors = await User.aggregate([
      {
        $match: queryConditions,
      },
      {
        $sort: sortOptions,
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: 'userextradetails',
          localField: '_id',
          foreignField: 'userId',
          as: 'userExtraDetails',
        },
      },
      {
        $addFields: {
          userExtraDetails: { $arrayElemAt: ['$userExtraDetails', 0] },
        },
      },
    ]);

    const spacility = await User.distinct('specialization', { role: 'DOCTOR' });

    const trimmedSpecialities = spacility.map(s => (s ? s.trim() : s));

    const uniqueTrimmedSpecialities = [...new Set(trimmedSpecialities)];

    res.json({
      data: Doctors,
      totalPages,
      spacility: uniqueTrimmedSpecialities,
      totalItems: count,
      status: true,
      message: 'Doctor list',
    });
  } catch (error) {
    console.log('errro', error)
    res
      .status(500)
      .json({ error: 'Failed to fetch doctors', status: true, message: 'error' });
  }
};




export const getDoctorsForApp = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const query = req.query.query || '';
  const specialization = req.query.specialization || '';
  const price = req.query.price || '';
  const gender = req.query.gender || '';
  const city = req.query.city || '';
  const role = req.role;
  const sortPrice = req.query?.pricesort || "";

  try {
    const queryConditions = {
      role: 'DOCTOR',
    };


    let mainQueryArr = [
      {
        userStatus: "online"
      }
    ]

    if (query && query != "") {
      mainQueryArr = [
        { name: { $regex: query, $options: 'i' } },
      ]
    }


    if (specialization && specialization != "") {
      mainQueryArr.push({ specialization: { $regex: specialization, $options: 'i' } })
    }

    if (gender && gender != "") {
      mainQueryArr.push({ gender: { $regex: gender, $options: 'i' } })
    }

    if (price && price != "") {
      queryConditions.serviceCharge = parseInt(price)
    }


    if (city) {
      queryConditions.city = city;
    }





    if (mainQueryArr && mainQueryArr.length > 0) {
      queryConditions.$and = mainQueryArr
    }




    if (role === 'PATIENT') {
      queryConditions.userAvaliableForonPatient = true;
    }

    if (role === 'FRANCHISE') {
      queryConditions.userAvaliableForFranchise = true;
    }




    let sortOptions = {
      createdAt: -1,
    };

    if (sortPrice && sortPrice != "") {
      sortOptions = {
        serviceCharge: sortPrice == "ASC" ? 1 : -1
      }
    }



    let mainPipeline = [
      {
        '$lookup': {
          'from': 'userextradetails',
          'localField': '_id',
          'foreignField': 'userId',
          'as': 'userExtraDetails'
        }
      },
      {
        '$addFields': {
          'userExtraDetails': {
            '$arrayElemAt': [
              '$userExtraDetails', 0
            ]
          }
        }
      },
      {
        $match: queryConditions,
      },
      {
        $sort: sortOptions,
      },
    ]



    console.log(JSON.stringify(mainPipeline, null, 2), "mainPipeline")

    const count = await User.aggregate([
      ...mainPipeline,
      {
        '$count': 'count'
      }
    ]);



    const totalPages = Math.ceil(parseInt(count.count) / limit);

    const Doctors = await User.aggregate([
      ...mainPipeline,
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ]);



    const spacility = await User.distinct('specialization', { role: 'DOCTOR' });


    res.json({
      data: Doctors,
      totalPages,
      spacility: spacility,
      totalItems: count.count,
      status: true,
      message: 'Doctor list',
    });
  } catch (error) {
    console.error(JSON.stringify(error, null, 2), "error")
    res
      .status(500)
      .json({ error: 'Failed to fetch doctors', status: true, message: 'error' });
    }
};



export const updateDoctorProfile = async (req, res) => {
  try {
    const UserId = req.user;
    const image = req.filename
    const { serviceCharge, address, name, pinCode, state, mobile, gender, specialization, abhaid } = req.body

    await User.findByIdAndUpdate(UserId, { serviceCharge, address, name, pinCode, state, mobile, gender, specialization, abhaid, image });

    const doctor = await User.findById(UserId);

    res.status(200).json({ status: true, message: 'Profile Updated!', data: doctor })

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to update Profile', status: false, message: 'error' });
  }
}

export const updateDoctorProfileByAdmin = async (req, res) => {
  try {
    const UserId = req.params.id;
    let image = req.image
    const {
      name,
      mobile,
      gender,
      specialization,
      serviceCharge,
      serviceChargepatient,
      address,
      degree,
      dob,
      registrationNumber,
      totalExperience,
      currentOrganization,
      whatsappNumber,
      panNumber,
      city,
      state,
      userAvaliableForonPatient,
      userAvaliableForFranchise,
      aadharNumber,
      password
    } = req.body;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      await User.findByIdAndUpdate(UserId, { serviceCharge, serviceChargepatient, password: hashedPassword, address, name, city, state, mobile, gender, specialization, image, userAvaliableForFranchise, userAvaliableForonPatient });
    } else {
      await User.findByIdAndUpdate(UserId, { serviceCharge, serviceChargepatient, address, name, city, state, mobile, gender, specialization, image, userAvaliableForFranchise, userAvaliableForonPatient });
    }


    const doctor = await User.findById(UserId);

    let mou = req.mou

    await updateUserExtraDetailsByUserId(UserId, {
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

    res.status(200).json({ status: true, message: 'Profile Updated!', data: doctor })

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to update Profile', status: false, message: 'error' });
  }
}

export const getDoctorprofile = async (req, res) => {
  try {
    const userId = req.user;

    const doctor = await User.findById(userId);
    res.status(200).json({ status: true, message: 'Profile!', data: doctor })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Profile', status: false, message: 'error' });
  }
}

export const getDoctorByIdReport = async (req, res) => {
  try {
    const { fromDate, toDate, appointmentMode, paymentMode, userType } = req.query;
    const userId = req.params.id;

    // Fetch the doctor's profile
    const doctor = await User.findById(userId);

    let fromDateStart = new Date(fromDate);
    fromDateStart.setHours(0, 0, 0, 0);

    let toDateEnd = new Date(toDate);
    toDateEnd.setHours(23, 59, 59, 999);

    let filter = {
      doctor: userId,
      status: 'completed',
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

    const commissionRate = 0.6;

    let upcomingFilter = {
      createdAt: {
        $gte: fromDateStart,
        $lte: toDateEnd,
      },
    };

    upcomingFilter.doctor = userId;
    upcomingFilter.status = { $ne: 'completed' };

    if (!doctor) {
      return res.status(404).json({ status: false, message: 'Doctor not found' });
    }

    if (userType) {
      const usersWithRole = await User.find({ role: userType });
      const userIDs = usersWithRole.map((user) => user._id);
      filter['expert'] = { $in: userIDs };
    }

    const appointments = await Appointment.find(filter)
      .select('patientName _id status appointmentCharge createdAt expert')
      .sort({ createdAt: -1 })
      .populate('expert', 'role');

    const appointmentsWithEarnings = appointments.map((appointment) => {
      const earning = appointment.appointmentCharge * commissionRate;
      return { ...appointment.toObject(), earning };
    });

    const appointmentCount = await Appointment.countDocuments(filter);

    const totalEarnings = appointmentsWithEarnings.reduce((total, appointment) => total + appointment.earning, 0);

    res.status(200).json({
      status: true,
      message: 'Profile and Appointment Count!',
      data: {
        user: doctor,
        appointments: appointmentsWithEarnings,
        appointmentCount: appointmentCount,
        totalEarning: totalEarnings,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch Profile and Appointment Count', status: false, message: 'error' });
  }
};



