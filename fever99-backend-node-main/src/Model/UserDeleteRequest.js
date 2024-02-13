import mongoose from 'mongoose'

const UserDeleteRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: String,
  requestDate: { type: Date, default: Date.now }  
}, {
  timestamps: true,
});


const UserDeleteRequest = mongoose.model('UserDeleteRequest', UserDeleteRequestSchema);
export default UserDeleteRequest