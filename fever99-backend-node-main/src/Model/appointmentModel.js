import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  expert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  selectedTimeSlot: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    enum: ['Video', 'Offline'],
    default: 'Video',
  },
  paymentMode: {
    type: String,
    enum: ['Online', 'Offline'],
    default: 'Online',
  },
  paymentStatus : {
    type: String,
    enum: ['Paid', 'Unpaid'],
    default: 'Unpaid',
  },
  patientName: {
    type: String,
    required: true
  },
  appointmentCharge: {
    type: Number,
    default: 0
  },
  serviceChargepatient: {
    type: Number,
    default: 0
  },
  age: {
    type: Number,
    required: true,

  },
  bodyTemperature: {
    type: String,
    required: false
  },
  bp: {
    type: String,
    required: false
  },
  callInprogress: {
    type: Boolean, 
    default: false
  },
  files: [
    {
      fileName: {
        type: String,
        required: false
      }
    }
  ],
  history: [
    {
      message: {
        type: String, required: true,        
      },
      fromId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      toId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      type: {
        type: 'String',
        required: false
      },
      timestamp: { type: Date, default: Date.now },
    }
  ],
  gender:{
    type: String,
    required: false
  },
  oxigne:{
    type: String,
    required: false
  },
  pulse: {
    type: String,
    required: false
  },
  suger1:{
    type: String,
    required: false
  },
  suger2:{
    type: String,
    required: false
  },
  suger3:{
    type: String,
    required: false
  },
  respiratoryRate: {
    type: String,
    required: false
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'canceled','completed','Follow-up'],
    default: 'pending',
  },

  
},{
  timestamps: true
});

appointmentSchema.methods.addHistory = function (message, fromId, toId, type) {
  this.history.push({
    fromId: fromId,
    toId: toId,
    message: message,
    type: type
  });

  return this.save();
};

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
