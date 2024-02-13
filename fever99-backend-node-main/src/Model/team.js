import mongoose from "mongoose";

const { Schema } = mongoose;

const teamSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String, default: null },
    name: { type: String, required: true },
    role: { type: String, required: true },
    twitter: { type: String, default: null },
    facebook: { type: String, default: null },
    linkedin: { type: String, default: null },
    instagram: { type: String, default: null },
    about: { type: String, default:''},
    type: { type: String, enum: ["medical", "support","marketing","Advisory_Panel"], default: 'medical' },
    status: { type: String, enum: ["active", "inactive"] , default: 'inactive'},
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);

export default Team;
