import { useList } from "@refinedev/core";
import { useState, useEffect } from "react";

interface PrivacyFilterParams {
  dateRange: [Date, Date];
  platform: string;
  appVersion: string;
}

interface ConsentData {
  id: number;
  consent_date: string;
  geolocation: string;
  purpose_id: number;
}

interface PurposeData {
  id: number;
  is_mandatory: boolean;
  expiration_date: string;
  is_reconsent_by_principal: boolean;
}

export const usePrivacyDashboardData = (filters: PrivacyFilterParams) => {
  // Fetch consents data with correct table name 'purpose' instead of 'purposes'
  const { data: consentsData, isLoading: isLoadingConsents } = useList({
    resource: "consents",
    filters: [
      {
        field: "consent_date",
        operator: "gte",
        value: filters.dateRange[0].toISOString(),
      },
      {
        field: "consent_date",
        operator: "lte",
        value: filters.dateRange[1].toISOString(),
      }
    ],
    meta: {
      select: "*, purpose(*)"
    }
  });

  // Add notice data fetching
  const { data: noticeData, isLoading: isLoadingNotice } = useList({
    resource: "notice"
  });

  // Initialize state with proper types
  const [mandatoryVsOptionalData, setMandatoryVsOptionalData] = useState<Array<{
    name: string;
    value: number;
    color: string;
  }>>([]);
  
  const [expiredConsentsData, setExpiredConsentsData] = useState<Array<{
    date: string;
    count: number;
  }>>([]);
  
  const [reconsentTrendsData, setReconsentTrendsData] = useState<Array<{
    date: string;
    count: number;
  }>>([]);
  
  const [geolocationData, setGeolocationData] = useState<Array<{
    location: string;
    count: number;
  }>>([]);

  // Add notice status state
  const [noticeStatusData, setNoticeStatusData] = useState<Array<{
    status: string;
    count: number;
  }>>([]);

  useEffect(() => {
    if (consentsData?.data) {
      // Transform Mandatory vs Optional data
      const mandatoryCount = consentsData.data.filter(
        (consent: any) => consent.purpose?.is_mandatory
      ).length;
      const optionalCount = consentsData.data.filter(
        (consent: any) => !consent.purpose?.is_mandatory
      ).length;

      setMandatoryVsOptionalData([
        { name: 'Mandatory', value: mandatoryCount, color: '#00C853' },
        { name: 'Optional', value: optionalCount, color: '#FF9800' }
      ]);

      // Transform Expired Consents Timeline data
      const expiredByMonth = new Map();
      consentsData.data.forEach((consent: any) => {
        const expirationDate = new Date(consent.purpose?.expiration_date);
        const monthKey = expirationDate.toISOString().slice(0, 7);
        expiredByMonth.set(monthKey, (expiredByMonth.get(monthKey) || 0) + 1);
      });
      setExpiredConsentsData(
        Array.from(expiredByMonth.entries()).map(([date, count]) => ({
          date,
          count
        }))
      );

      // Transform Reconsent Trends data
      const reconsentByMonth = new Map();
      consentsData.data.forEach((consent: any) => {
        if (consent.purpose?.is_reconsent_by_principal) {
          const monthKey = new Date(consent.consent_date).toISOString().slice(0, 7);
          reconsentByMonth.set(monthKey, (reconsentByMonth.get(monthKey) || 0) + 1);
        }
      });
      setReconsentTrendsData(
        Array.from(reconsentByMonth.entries()).map(([date, count]) => ({
          date,
          count
        }))
      );

      // Transform Geolocation data
      const geoCount = new Map<string, number>();
      consentsData.data.forEach((consent: any) => {
        // Get the country code and ensure it's uppercase
        const location = (consent.geolocation || 'UNKNOWN').toUpperCase();
        geoCount.set(location, (geoCount.get(location) || 0) + 1);
      });

      setGeolocationData(
        Array.from(geoCount.entries())
          .filter(([location]) => location !== 'UNKNOWN')
          .map(([location, count]) => ({
            location,  // This should match the country code format expected by jVectorMap
            count
          }))
          .sort((a, b) => b.count - a.count) // Sort by count in descending order
      );
    }
  }, [consentsData?.data]);

  useEffect(() => {
    if (noticeData?.data) {
      const statusCount = noticeData.data.reduce((acc: Record<string, number>, notice: any) => {
        const status = notice.status || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      setNoticeStatusData(
        Object.entries(statusCount).map(([status, count]) => ({
          status: status.charAt(0).toUpperCase() + status.slice(1),
          count
        }))
      );
    }
  }, [noticeData?.data]);

  return {
    mandatoryVsOptionalData,
    expiredConsentsData,
    reconsentTrendsData,
    geolocationData,
    noticeStatusData,
    isLoading: isLoadingConsents || isLoadingNotice
  };
};
