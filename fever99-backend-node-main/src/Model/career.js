import mongoose from 'mongoose'

const careerSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  applyAs: String,
  gender: String,
  dob: Date,
  higherQualification: String,
  address: String,
  experience: Number,
  resume: String,
}, { timestamps: true });

const Career = mongoose.model('Career', careerSchema);
export default Career
// module.exports = Career;
