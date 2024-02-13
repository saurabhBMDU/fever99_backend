import { Schema, model } from "mongoose";

const franchiseRequestSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  gender: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  profession: { type: String, required: true },
}, { timestamps: true });

const FranchiseRequest = model("FranchiseRequest", franchiseRequestSchema);
export default FranchiseRequest