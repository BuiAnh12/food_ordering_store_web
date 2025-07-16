import axios from "../libs/axiosInstance";

export const getAllStaff = async (storeId) => {
  try {
    const res = await axios.get(`/store/${storeId}/staff`);
    return res.data;
  } catch (error) {
    console.error("Get all staff error:", error);
    return error.response?.data || { message: "Unknown error occurred" };
  }
};

export const getStaff = async ({ storeId, staffId }) => {
  try {
    const res = await axios.get(`/store/${storeId}/staff/${staffId}`);
    return res.data;
  } catch (error) {
    console.error("Get staff error:", error);
    return error.response?.data || { message: "Unknown error occurred" };
  }
};

export const createStaff = async ({ storeId, staffData }) => {
  try {
    const res = await axios.post(`/store/${storeId}/staff/add`, staffData);
    return res.data;
  } catch (error) {
    console.error("Create staff error:", error);
    return error.response?.data || { message: "Unknown error occurred" };
  }
};

export const updateStaff = async ({ storeId, staffData }) => {
  try {
    const res = await axios.put(`/store/${storeId}/staff/update`, staffData);
    return res.data;
  } catch (error) {
    console.error("Update staff error:", error);
    return error.response?.data || { message: "Unknown error occurred" };
  }
};
