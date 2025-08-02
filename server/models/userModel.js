import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    name: {
        type: String,   
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    verifyOtp: {
        type: String,   
        default:''
    },
    verifyOtpExpire: {
        type: Date,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetOtp: {
        type: String,
        default: ''
    },
    resetOtpExpire: {
        type: Date,
        default: 0
    }

})


const userModel = mongoose.models.user|| mongoose.model('User', UserSchema);
export default userModel;