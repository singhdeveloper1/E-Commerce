import User from "../models/user.model.js"
import { errorHandler } from "../utils/errorHandler.js"
import admin from "../utils/firebasePushNotification.js"

//! allow notification
export const enableNotification = async (req, res, next)=>{
    const {fcmToken} = req.body

    try {
        const user = await User.findByIdAndUpdate(req.user._id,{
            $set : {
                fcmToken : fcmToken
            }
        },{new : true})
        res.status(200).json("Notification marked as allowed")
    } catch (error) {
        console.log("allow notification m h error", error)
        next(error)
    }
}

//! disable notification
export const disableNotification = async (req, res, next)=>{
    try {
        const user = await User.findByIdAndUpdate(req.user._id,{
            $unset : {
                fcmToken : ""
            }
        },{new : true}) 
        res.status(200).json("Notification marked as disabled")
    } catch (error) {
        console.log("disable notification m h error", error)        
        next(error)
    }
}

//! send notification
export const sendNotification = async (req, res, next) => {
  const { email, title, body } = req.body;
  try {
    if (email) {
      const user = await User.findOne({ email });
      if (!user?.fcmToken)
        return next(errorHandler(400, "notification is disabled by user!!"));
      const message = {
        notification: { title, body },
        token: user.fcmToken,
      };

      const response = await admin.messaging().send(message);
      res.status(200).json("notification send successfullyy", response);
    } else {
      const userWithFCMtoken = await User.find({ fcmToken: { $exists: true } });

      const tokens = userWithFCMtoken.map((user) => user.fcmToken);

      if (tokens.length === 0)
        return next(
          errorHandler(400, "notification is disabled by all the Users!!")
        );

      const message = {
        notification: { title, body },
        tokens,
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      res.status(200).json("notification send successfullyy!!!", response);
    }
  } catch (error) {
    console.log("send notification m h error", error);
    next(error);
  }
};