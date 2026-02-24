import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@/lib/api/auth';

export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await authAPI.login(email, password);

      if (!response || response.status !== 200) {
        throw new Error('Login failed');
      }

      return response.data;
    },
  });
}
