import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signup } from '../lib/api';

const useSignup = () => {
    const queryClient = useQueryClient()
    const { mutate, isPending, error  } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      // First invalidate the auth query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/")
    }
  });
  return {signupMutation: mutate,isPending,error}
}

export default useSignup
