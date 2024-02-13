import mongoose from 'mongoose'

const TempmobileSchema = new mongoose.Schema({
  
  mobile: String,  
  otp: String,
  
}, { timestamps: true });

const Tempmobile = mongoose.model('Tempmobile', TempmobileSchema);
export default Tempmobile
