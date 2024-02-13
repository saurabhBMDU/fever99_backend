import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String , required: true, unique: true},
    refrelCode: { type: String, default: null },
    usedRefrel: { type: String, default: null },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    password: { type: String, required: true },
    specialization: { type: String, default: null },
    serviceCharge: { type: Number, default: 0 },
    serviceChargepatient: { type: Number, default: 0 },
    address: { type: String, default: "" },
    state: { type: String, default: "" },
    city: { type: String, default: null },
    pinCode: { type: Number, default: null },
    medicalHistory: { type: String, default: null },
    userStatus: { type: String, enum: ["online", "offline"], default: "offline" },
    userAvaliableForonPatient: { type: Boolean, default: false },
    userAvaliableForFranchise: { type: Boolean, default: false },
    pinUser: { type: Boolean, default: false },
    languageKnown: [],
    timeSlot: [

    ],
    otp: {type: String, default: null},
    timeSlotoffline: [],
    abhaid: { type: String, default: null },
    role: {
      type: String,
      enum: ["DOCTOR", "ADMIN", "PATIENT", "FRANCHISE", "CORDINATOR"],
      default: "PATIENT",
    },
    image: { type: String, default: "user.png" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User
// module.exports = User;
