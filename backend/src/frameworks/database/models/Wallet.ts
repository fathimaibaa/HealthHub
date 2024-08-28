import mongoose from "mongoose";
const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  balance: {
    type: Number,
    default: 0,
  },
},{timestamps:true});

export default mongoose.model("Wallet", walletSchema);