import mongoose from "mongoose";
import { User } from "../../types/user/userTypes";

const userSchema = new mongoose.Schema<User>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const userModel = mongoose.model<User>('User', userSchema);

export default userModel;