import mongoose, { Schema } from "mongoose";

const UserFcmTokenschema = new Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
        },
        token: String,
    },
    { timestamps: true })

const UserFcmToken = mongoose.model('UserFcmTokens', UserFcmTokenschema);
export default UserFcmToken