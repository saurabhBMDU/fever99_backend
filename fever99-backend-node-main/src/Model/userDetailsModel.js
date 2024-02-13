// models/userExtraDetailsModel.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const userDetailsSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  degree: {
    type: String,
    default: null,
  },
  registrationNumber: {
    type: String,
    default: null,
  },
  totalExperience: {
    type: String,
    default: null,
  },
  clinicName: {
    type: String,
    default: null,
  },
  currentOrganization: {
    type: String,
    default: null,
  },
  whatsappNumber: {
    type: String,
    default: null,
  },
  dob: Date,
  panNumber: {
    type: String,
    default: null,
  },
  profession: [],
  aadharNumber: {
    type: String,
    default: null,
  },
  aadharFile: {
    type: String,
    default: null,
  },
  panFile: {
    type: String,
    default: null,
  },
  licence: {
    type: String,
    default: null
  },
  mou: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

const UserExtraDetails = mongoose.model('UserExtraDetails', userDetailsSchema);
export default UserExtraDetails