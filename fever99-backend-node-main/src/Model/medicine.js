import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: String,
  combination: String,
  company: String,
}, {
  timestamps: true,
});

const Medicine = mongoose.model('Medicine', medicineSchema);
export default Medicine
// module.exports = Medicine;
