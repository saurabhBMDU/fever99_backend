import mongoose from "mongoose"

const { Schema } = mongoose;
const ComplaintSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    resolution: {
      type: String,
      default: null,
    },
    status: { type: String, enum: ["Open", "Closed"], default: "Open" },
  },
  { timestamps: true }
);

const RaiseComplaint = mongoose.model("RaiseComplaint", ComplaintSchema);
export default RaiseComplaint
// module.exports = RaiseComplaint;
