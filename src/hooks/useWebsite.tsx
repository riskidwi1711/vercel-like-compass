
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiService, Website } from '@/services/api';
import { toast } from 'sonner';

interface WebsiteContextType {
  websites: Website[];
  selectedWebsite: Website | null;
  selectedWebsiteId: string | null;
  setSelectedWebsiteId: (websiteId: string | null) => void;
  loading: boolean;
  refreshWebsites: () => Promise<void>;
  createWebsite: (name: string, domain: string, theme?: string) => Promise<void>;
}

const WebsiteContext = createContext<WebsiteContextType | undefined>(undefined);

export function WebsiteProvider({ children }: { children: ReactNode }) {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebsiteId, setSelectedWebsiteIdState] = useState<string | null>(
    localStorage.getItem('selectedWebsiteId')
  );
  const [loading, setLoading] = useState(true);

  const selectedWebsite = websites.find(w => w._id === selectedWebsiteId) || null;

  const setSelectedWebsiteId = (websiteId: string | null) => {
    setSelectedWebsiteIdState(websiteId);
    if (websiteId) {
      localStorage.setItem('selectedWebsiteId', websiteId);
    } else {
      localStorage.removeItem('selectedWebsiteId');
    }
  };

  const refreshWebsites = async () => {
    try {
      setLoading(true);
      const response = await apiService.getWebsites();
      setWebsites(response.data);
      
      // Auto-select first website if none selected
      if (!selectedWebsiteId && response.data.length > 0) {
        setSelectedWebsiteId(response.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to load websites:', error);
      toast.error('Failed to load websites');
    } finally {
      setLoading(false);
    }
  };

  const createWebsite = async (name: string, domain: string, theme: string = 'default') => {
    try {
      const response = await apiService.createWebsite(name, domain, theme);
      setWebsites(prev => [...prev, response.data]);
      setSelectedWebsiteId(response.data._id);
      toast.success(`Website "${name}" created successfully!`);
    } catch (error) {
      console.error('Failed to create website:', error);
      toast.error('Failed to create website');
      throw error;
    }
  };

  useEffect(() => {
    refreshWebsites();
  }, []);

  return (
    <WebsiteContext.Provider value={{
      websites,
      selectedWebsite,
      selectedWebsiteId,
      setSelectedWebsiteId,
      loading,
      refreshWebsites,
      createWebsite
    }}>
      {children}
    </WebsiteContext.Provider>
  );
}

export function useWebsite() {
  const context = useContext(WebsiteContext);
  if (context === undefined) {
    throw new Error('useWebsite must be used within a WebsiteProvider');
  }
  return context;
}
