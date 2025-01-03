import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AdminDashboardMetrics } from "@/types/admin-dashboard";

interface MetricsContextType {
  metrics: AdminDashboardMetrics | null;
  isLoading: boolean;
  error: Error | null;
}

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

export const useAdminMetrics = () => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error('useAdminMetrics must be used within a MetricsProvider');
  }
  return context;
};

interface MetricsProviderProps {
  children: ReactNode;
}

export const AdminMetricsProvider = ({ children }: MetricsProviderProps) => {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ["admin-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_admin_dashboard_metrics", {
        time_range: "7d"
      });
      
      if (error) throw error;
      
      // Type guard to validate the data structure
      const isValidMetrics = (data: any): data is AdminDashboardMetrics => {
        return (
          data &&
          typeof data === 'object' &&
          'overview' in data &&
          'userMetrics' in data &&
          'productMetrics' in data
        );
      };
      
      if (!isValidMetrics(data)) {
        throw new Error("Invalid metrics data structure");
      }
      
      return data;
    }
  });

  return (
    <MetricsContext.Provider value={{ metrics, isLoading, error: error as Error | null }}>
      {children}
    </MetricsContext.Provider>
  );
};