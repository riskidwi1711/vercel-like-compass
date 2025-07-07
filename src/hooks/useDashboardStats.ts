
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useWebsite } from './useWebsite';

export function useDashboardStats() {
  const { selectedWebsiteId } = useWebsite();
  
  return useQuery({
    queryKey: ['dashboard-stats', selectedWebsiteId],
    queryFn: async () => {
      if (!selectedWebsiteId) {
        throw new Error('No website selected');
      }
      const response = await apiService.getDashboardStats(selectedWebsiteId);
      return response.data;
    },
    enabled: !!selectedWebsiteId,
    refetchInterval: 30000,
  });
}
