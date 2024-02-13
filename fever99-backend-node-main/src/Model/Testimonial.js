import mongoose from "mongoose";

const { Schema } = mongoose;

const testimonialSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the user who provided the testimonial
    image: { type: String, required: false },
    name: { type: String, required: true },
    role: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);


export default Testimonial;