import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
      const response = await axiosInstance.post("/auth/signup", signupData);
      return response.data;
}

export const getAuthUser = async () => {
      const res = await axiosInstance.get('/auth/me');
      return res.data;
}

export const completOnboarding = async(userData)=>{
      const res = await axiosInstance.post('/auth/onboarding',userData)
      return res.data
}