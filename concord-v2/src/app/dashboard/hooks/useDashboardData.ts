import { useList } from "@refinedev/core";

interface FilterParams {
  dateRange: [Date, Date];
  platform: string;
  appVersion: string;
}

export const useDashboardData = (filters: FilterParams) => {
  const { data: consentsData, isLoading: isLoadingConsents } = useList({
    resource: "consents",
    pagination: {
      pageSize: 1000,
    }
  });

  const { data: purposesData, isLoading: isLoadingPurposes } = useList({
    resource: "purpose",
    pagination: {
      pageSize: 1000,
    }
  });

  const { data: formsData, isLoading: isLoadingForms } = useList({
    resource: "forms",
    pagination: {
      pageSize: 1000,
    }
  });

  const { data: noticesData, isLoading: isLoadingNotices } = useList({
    resource: "notice",
    pagination: {
      pageSize: 1000,
    }
  });

  const aggregateData = {
    totalPurposes: purposesData?.total || 0,
    totalForms: formsData?.total || 0,
    totalConsents: consentsData?.total || 0,
    totalNotices: noticesData?.total || 0,
  };

  return {
    aggregateData,
    isLoading: isLoadingConsents || isLoadingPurposes || isLoadingForms || isLoadingNotices,
  };
}; 