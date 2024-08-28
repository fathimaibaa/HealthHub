import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        required: true,
        unique: true,
    },
    isListed: { 
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model('Department', departmentSchema);
