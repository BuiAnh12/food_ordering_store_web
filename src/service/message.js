import axios from "../libs/axiosInstance";
import { deleteFile } from "./upload"; // You need this to delete the uploaded image if needed

// ✅ Send a message to a chat
export const sendMessage = async ({ id, data }) => {
  try {
    const res = await axios.post(`/message/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Send message error:", error);
    return error.response?.data || { message: "Unknown error occurred" };
  }
};

// ✅ Get all messages in a chat
export const getAllMessages = async (id) => {
  try {
    const res = await axios.get(`/message/${id}`);
    return res.data;
  } catch (error) {
    console.error("Get all messages error:", error);
    return error.response?.data || { message: "Unknown error occurred" };
  }
};

// ✅ Delete a message (and delete file from storage if applicable)
export const deleteMessage = async (id) => {
  try {
    const res = await axios.delete(`/message/delete/${id}`);
    const deletedMessage = res.data;

    // Optional: Also delete associated image file from storage
    if (deletedMessage?.image?.filePath) {
      try {
        await deleteFile({ filePath: deletedMessage.image.filePath });
      } catch (uploadError) {
        console.error("Error deleting image file:", uploadError);
      }
    }

    return deletedMessage;
  } catch (error) {
    console.error("Delete message error:", error);
    return error.response?.data || { message: "Unknown error occurred" };
  }
};
