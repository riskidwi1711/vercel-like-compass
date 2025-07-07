
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await apiService.getDashboardStats();
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
