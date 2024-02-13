import mongoose from "mongoose";

const { Schema } = mongoose

const serviceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: false
    },
    price: {
      type: Number,
      default: 0,
    },
    pinCode: [],
    image: {
      type: String,
      default: "service.png",
    },
    keyFeture: [
      {
        key: { type: String, default: null },
        featers: { type: String, default: null },
      },
    ],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;
