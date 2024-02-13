import UserFcmToken from "../Model/UserFcmTokensModel.js";
import Appointment from "../Model/appointmentModel.js";
import { fcmMulticastNotify, fcmNotify } from "../helpers/fcmNotify.js";
export const checkAndRegisterFcmToken = async (req, res, next) => {
  try {
    console.log(req.user);
    let tokenExist = await UserFcmToken.findOne({
      userId: req.user,
      token: req.body.token,
    })
      .lean()
      .exec();
    if (!tokenExist)
      await new UserFcmToken({
        userId: req.user,
        token: req.body.token,
      }).save();
    res.status(200).json({ message: "FCM Token ", success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const sendNotificationBefore = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); 
  const time = `${new Date().getHours()}:${new Date().getMinutes()}`;

  console.log('time', time)
  const apmt = await Appointment.find({
    dateTime: {
      $gte: today,
      $lt: tomorrow,
    },
  }).select("dateTime doctor expert selectedTimeSlot");

  if(apmt.length) {
    for (const appointment of apmt) {
        console.log(appointment)
    }
  }

};

export const notifyUsers = async (req, res, next) => {
  try {
    console.log(req.body, req.user, "userId");
    let appointmentObj = await Appointment.findById(
      req.body.appointmentId
    ).exec();
    console.log(
      appointmentObj,
      "appointmentObj",
      JSON.stringify(appointmentObj, null, 2)
    );
    let arr = [];

    let doctorTokenObj;
    let expertTokenObj;
    if (
      appointmentObj &&
      appointmentObj.doctor &&
      appointmentObj.doctor != ""
    ) {
      doctorTokenObj = await UserFcmToken.find({
        userId: appointmentObj.doctor,
      }).exec();
      if (doctorTokenObj) {
        let notificationObj = {
          tokens: [...doctorTokenObj.map((el) => el?.token)],
          data: {
            title:
              req.user == appointmentObj.doctor
                ? "You have joined an appointment"
                : "Client has joined an appointment",
            description:
              req.user == appointmentObj.doctor
                ? "You have joined an appointment"
                : "Client has joined an appointment",
            otherData: req.user == appointmentObj.doctor ? "hide" : "show",
            appointmentId: `${req.body.appointmentId}`,
          },
        };
        await fcmMulticastNotify(notificationObj);
      }
    }

    if (
      appointmentObj &&
      appointmentObj.expert &&
      appointmentObj.expert != ""
    ) {
      expertTokenObj = await UserFcmToken.find({
        userId: appointmentObj.expert,
      }).exec();
      console.log(expertTokenObj, "expertTokenObj");
      if (expertTokenObj) {
        let notificationObj = {
          tokens: [...expertTokenObj.map((el) => el?.token)],
          data: {
            title:
              req.user == appointmentObj.expert
                ? "You have joined an appointment"
                : "has joined an appointment",
            description:
              req.user == appointmentObj.expert
                ? "You have joined an appointment"
                : "has joined an appointment",
            otherData: req.user == appointmentObj.expert ? "hide" : "show",
            appointmentId: `${req.body.appointmentId}`,
          },
        };
        await fcmMulticastNotify(notificationObj);
      }
    }

    // let fcmObj = await UserFcmToken.findOne({ userId: ${el._id} }).lean().exec();
    // if (fcmObj?.token) {

    //     arr.push(fcmObj?.token);
    // }
    // let tokenExist = await UserFcmToken.findOne({ userId: req.user.userId, token: req.body.token }).lean().exec();
    res.status(200).json({ message: "FCM Token ", success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
