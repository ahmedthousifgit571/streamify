import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
      const response = await axiosInstance.post("/auth/signup", signupData);
      return response.data;
}

export const login = async (loginData) =>{
      const response = await axiosInstance.post("/auth/login",loginData)
      return response.data
}

export const logout = async () =>{
      const response = await axiosInstance.post("/auth/logout")
      return response.data
}

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completOnboarding = async(userData)=>{
      const res = await axiosInstance.post('/auth/onboarding',userData)
      return res.data
}

export const getUserFriends = async() =>{
      const res = await axiosInstance.get('/users/friends')
      return res.data
}

export const getRecommendedUsers = async() =>{
      const res =  await axiosInstance.get('/users')
      return res.data
}

export const getOutgoingFriendRequests = async() =>{
      const res = await axiosInstance.get('/users/outgoing-friendRequests')
      return res.data
}

export const sendFriendRequests = async(userId) =>{
      const res = await axiosInstance.post(`/users/friend-request/${userId}`)
      return res.data
}

export const getFriendRequests = async() =>{
      const res = await axiosInstance.get("/users/friend-requests")
      return res.data
}

export const acceptFriendRequest = async(requestId) =>{
      const res = await axiosInstance.put(`/users/friends/${requestId}/accept`)
      return res.data
}

export const getStreamToken = async() =>{
      const res = await axiosInstance.get('/chat/token')
      return res.data
}