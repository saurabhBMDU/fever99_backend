
import Appointment from '../Model/appointmentModel.js'

export const AddAppointmentHistory = async (appointmentId, userId, toId, message) => {
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new Error("Appointment Not Found!");
    }

    appointment.addHistory(message, userId, toId);

    return true
  } catch (error) {
    return error
  }
};