import mongoose from "mongoose";

const { Schema } = mongoose

const insurenceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: {
      type: String,
      // required: true,
    },
    mobile: {
      type: String,
      // required: true,
    },
    age: {
      type: Number,
      // required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female","other"],
      default: "male",
      required: false
    },
    email: {
      type: String,
      // required: true
    },
    state: {
      type: String,
      // required: true
    },
    district:{
      type: String,
      // required: true
    },
    city: {
      type: String,
      // required: true
    },
    address: {
      type: String,
      // required: true
    },
    comment: {
      type: String,
      // required: true
    },
    famelymember: [
      {
       fname: String,
       age: Number
      }
    ],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  {
    timestamps: true,
  }
);

const Insurence = mongoose.model("Insurence", insurenceSchema);

export default Insurence;
