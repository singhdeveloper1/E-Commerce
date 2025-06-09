import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // 24 hour
  },
});

const BlackListToken = mongoose.model("BlackListToken", blacklistTokenSchema);

export default BlackListToken;
