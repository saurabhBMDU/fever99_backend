import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }, // Add a 'read' field
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});



const Notification = mongoose.model('Notification', notificationSchema);
export default Notification