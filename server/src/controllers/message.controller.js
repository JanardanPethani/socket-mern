import { uploadImage } from "../lib/cloudinary.js";
import { bufferToDataURI } from "../lib/multer.js";
import Message from "../models/Message.model.js";
import User from "../models/User.model.js";

export const getUsersListForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const usersExceptLoggedInUser = await User.find({
      _id: { $ne: loggedInUserId },
    });

    res.status(200).json(usersExceptLoggedInUser.map((user) => user.profile));
  } catch (err) {
    console.error("Error in getUsersListForSidebar: ", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: loggedInUserId, receiver: userId },
        { sender: userId, receiver: loggedInUserId },
      ],
    });

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error in getMessages: ", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { userId } = req.params;
    const { message } = req.body;
    const image = req.file;

    let imageUrl = null;
    let imagePublicId = null;
    if (image) {
      // Convert buffer to data URI using our helper
      const dataURI = bufferToDataURI(image.mimetype, image.buffer);
      const uploadResult = await uploadImage(dataURI);
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;
    }

    const newMessage = new Message({
      sender: loggedInUserId,
      receiver: userId,
      message,
      imageUrl,
      imagePublicId,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error in sendMessage: ", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== loggedInUserId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Message.findByIdAndDelete(messageId);

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("Error in deleteMessage: ", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
