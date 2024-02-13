import mongoose from "mongoose";

const { Schema } = mongoose;

const prescriptionSchema = new Schema(
  {
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    symptoms: {
      type: String,
      required: false,
    },
    diagnosis: {
      type: String,
      required: false,
    },
    medicine: [],
    investigation: {
      type: String,
      required: false,
    },
    pastHistory: {
      type: String,
      required: false,
    },
    surgicalHistory: {
      type: String,
      required: false,
    },
    personalHistory: {
      type: String,
      required: false,
    },
    drugAllergy: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription