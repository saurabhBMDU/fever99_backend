import mongoose from "mongoose";

const { Schema } = mongoose;

const serviceOrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    customerName: { type: String, required: true },
    serviceName: {type: String, required: true},
    mobile: { type: String, default: null },
    age: { type: String, default: null },
    gender: { type: String, default: null },
    medicalProblem: { type: String, default: null },
    status: { type: String, enum: ["pending", "completed", "canceled"], default: "pending" },
    requestDate: { type: Date, default : Date.now },
    state: {type: String, default: null},    
    city: {type: String, default: null},    
    pin_code: {type: String, default: null},    
    requestTime: {type: String, default: null},    
    amount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
  },
  { timestamps: true }
);

const ServiceOrder = mongoose.model("ServiceOrder", serviceOrderSchema);

export default ServiceOrder;