import { useMutation, useQueryClient } from "@tanstack/react-query"
import { completOnboarding } from "../lib/api"
import { useNavigate } from "react-router-dom"


const useOnboarding = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const {mutate , isPending} = useMutation({
    mutationFn: completOnboarding,
    onSuccess : ()=>{
      toast.success("Profile onboarded successfully")
      queryClient.invalidateQueries({queryKey :["authUser"]})
      navigate("/")
    },
    onError: (error)=>{
      toast.error(error.response.data.message)
    }
  })
  return {onboardingMutation:mutate, isPending}
}

export default useOnboarding
