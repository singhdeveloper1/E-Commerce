import mongoose, { now, Schema } from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
  },

  company: {
    type: String,
  },

  apartment: {
    type: String,
  },

  street: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  pinCode: {
    type: String,
    required: true,
  },

  phone: {
    type: Number,
    required: true,
  },

  email: {
    type: String,
    required: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "invalid email"],
  },
});

const Address = mongoose.model("Address", addressSchema);

export default Address;
