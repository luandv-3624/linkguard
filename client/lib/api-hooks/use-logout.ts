import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api/auth';

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return authAPI.logout();
    },

    onSuccess: () => {
      queryClient.clear();

      router.push('/login');
      router.refresh();
    },

    onError: (error) => {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    },
  });
}
