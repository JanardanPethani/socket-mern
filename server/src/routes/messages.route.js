import express from "express";
import {
  deleteMessage,
  getMessages,
  getUsersListForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";
import { auth } from "../middleware/auth.js";
import { singleImageUpload } from "../lib/multer.js";

const messageRouter = express.Router();

messageRouter.get("/users", auth, getUsersListForSidebar);
messageRouter.get("/:userId", auth, getMessages);

messageRouter.post("/send/:userId", auth, singleImageUpload, sendMessage);
messageRouter.delete("/:messageId", auth, deleteMessage);

export default messageRouter;
