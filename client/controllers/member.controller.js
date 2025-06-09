import Member from "../models/member.model.js"
import { errorHandler } from "../utils/errorHandler.js"
import uploadToClodinary from "./clodinary.controller.js"

//! add member
export const addMember = async (req, res, next) => {
  let { name, designation, social } = req.body;

  if (typeof social === "string") {
    social = JSON.parse(social);
  }
  if (!req.user.isSeller)
    return next(errorHandler(401, "you are not a seller!!"));

  let imageUrl = "";

  if (req.file) {
    const result = await uploadToClodinary(req, "Member_Image", next);
    imageUrl = result.secure_url;
  }

  const newMember = new Member({
    image: imageUrl,
    name,
    designation,
    social,
  });

  try {
    await newMember.save();

    res.status(200).json("member added successfully!!");
  } catch (error) {
    console.log("add member mh error", error);
    next(error);
  }
};

//! update Member

export const updateMember = async (req, res, next) => {
  let { name, designation, social } = req.body;

  if (typeof social == "string") {
    social = JSON.parse(social);
  }

  if (!req.user.isSeller)
    return next(errorHandler(401, "you are not a seller!!"));

  const member = await Member.findById(req.params.memberId);

  let imageUrl = "";

  if (req.file) {
    const result = await uploadToClodinary(req, "Member_Image", next);
    imageUrl = result.secure_url;
  }

  if (imageUrl.length == 0) {
    imageUrl = member.image;
  }

  try {
    await Member.findByIdAndUpdate(
      req.params.memberId,
      {
        image: imageUrl,
        name,
        designation,
        social,
      },
      { new: true }
    );

    res.status(200).json("member updated successfully!!");
  } catch (error) {
    console.log("update Member m h error", error);
    next(error);
  }
};

//! delete Member

export const deleteMember = async (req, res, next) => {
  if (!req.user.isSeller)
    return next(errorHandler(401, "you are not a seller!"));

  try {
    await Member.findByIdAndDelete(req.params.memberId);
    res.status(200).json("member deleted successfully!!");
  } catch (error) {
    console.log("delete member m h error", error);
    next(error);
  }
};

//! get specific member

export const getSpecificMember = async (req, res, next) => {
  if (!req.user.isSeller)
    return next(errorHandler(401, "you are not a seller"));
  try {
    const member = await Member.findById(req.params.memberId);

    res.status(200).json(member);
  } catch (error) {
    console.log("get specific member m h error", error);
    next(error);
  }
};