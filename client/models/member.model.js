import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  designation: {
    type: String,
    required: true,
  },

  social: {
    twitter: {
      type: String,
      default: "twitter.com",
      required: true,
    },

    instagram: {
      type: String,
      default: "instagram.com",
      required: true,
    },

    linkedin: {
      type: String,
      default: "linkedin.com",
      required: true,
    },
  },
});

const Member = mongoose.model("Member", memberSchema);

export default Member;
