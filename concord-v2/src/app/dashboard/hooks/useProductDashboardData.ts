import { useState, useEffect, useMemo } from "react";
import { useList } from "@refinedev/core";

const STATUS_COLORS = {
  GRANTED: "#4CAF50",
  PENDING: "#FFC107",
  REVOKED: "#F44336",
} as const;

interface FilterParams {
  dateRange?: [Date, Date];
  platform?: string;
  purpose?: string;
  appVersion?: string;
}

interface AggregateData {
  totalConsents: number;
  totalForms: number;
  totalPurposes: number;
  totalNotices: number;
}

interface ConsentStatusItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface FormPermissionsData {
  formName: string;
  permissionCount: number;
}

interface ConsentTrendItem {
  date: string;
  GRANTED: number;
  PENDING: number;
  REVOKED: number;
}

interface EntityFormCount {
  entity_id: string;
  entity_name: string;
  form_count: number;
}

export const useProductDashboardData = (filters: FilterParams) => {
  const [aggregateData, setAggregateData] = useState<AggregateData>({
    totalConsents: 0,
    totalForms: 0,
    totalPurposes: 0,
    totalNotices: 0
  });
  const [consentStatusData, setConsentStatusData] = useState<ConsentStatusItem[]>([]);
  const [appVersionsData, setAppVersionsData] = useState<string[]>([]);
  const [formsPermissionsData, setFormsPermissionsData] = useState<FormPermissionsData[]>([]);
  const [consentTrendsData, setConsentTrendsData] = useState<ConsentTrendItem[]>([]);

  // Fetch data
  const { data: consentsData, isLoading: isLoadingConsents } = useList({
    resource: "consents"
  });

  const { data: purposesData, isLoading: isLoadingPurposes } = useList({
    resource: "purpose",
    meta: {
      select: "*, entity_ids"
    }
  });

  const { data: formsData, isLoading: isLoadingForms } = useList({
    resource: "forms",
    meta: {
      select: "*, purpose_ids"
    }
  });

  // Fetch entities data
  const { data: entitiesData, isLoading: isLoadingEntities } = useList({
    resource: "entity",
    meta: {
      select: "id, entity_name"
    }
  });

  // Set aggregate data
  useEffect(() => {
    if (consentsData?.data && purposesData?.data && formsData?.data) {
      setAggregateData({
        totalPurposes: purposesData.data.length || 0,
        totalForms: formsData.data.length || 0,
        totalConsents: consentsData.data.length || 0,
        totalNotices: 0
      });
    }
  }, [consentsData?.data, purposesData?.data, formsData?.data]);

  // Set consent status data
  useEffect(() => {
    if (consentsData?.data) {
      const statusCounts = consentsData.data.reduce((acc: Record<string, number>, consent: any) => {
        const status = (consent.consent_status || 'pending').toLowerCase();
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

      setConsentStatusData([
        { 
          name: 'granted', 
          value: statusCounts.granted || 0,
          percentage: total ? Math.round(((statusCounts.granted || 0) / total) * 100) : 0,
          color: STATUS_COLORS.GRANTED 
        },
        { 
          name: 'pending', 
          value: statusCounts.pending || 0,
          percentage: total ? Math.round(((statusCounts.pending || 0) / total) * 100) : 0,
          color: STATUS_COLORS.PENDING 
        },
        { 
          name: 'revoked', 
          value: statusCounts.revoked || 0,
          percentage: total ? Math.round(((statusCounts.revoked || 0) / total) * 100) : 0,
          color: STATUS_COLORS.REVOKED 
        }
      ]);
    }
  }, [consentsData?.data]);

  // Transform forms entity data
  const transformedFormsEntityData = useMemo(() => {
    if (!formsData?.data || !purposesData?.data || !entitiesData?.data) return [];

    // Create a map of entity IDs to names
    const entityMap = new Map(
      entitiesData.data.map(entity => [entity.id, entity.entity_name])
    );

    // Create a map of purpose IDs to entity IDs
    const purposeEntityMap = new Map(
      purposesData.data.map(purpose => [
        purpose.id,
        purpose.entity_ids || []
      ])
    );

    // Count forms per entity
    const entityFormCounts = new Map<string, number>();

    // Process each form
    formsData.data.forEach(form => {
      // Get all purpose IDs for this form
      const purposeIds = form.purpose_ids || [];

      // Get all entity IDs associated with these purposes
      const entityIds = new Set<string>();
      purposeIds.forEach((purposeId: string) => {
        const entityIdsForPurpose = purposeEntityMap.get(purposeId) || [];
        entityIdsForPurpose.forEach((entityId: string) => entityIds.add(entityId));
      });

      // Increment count for each entity
      entityIds.forEach(entityId => {
        entityFormCounts.set(
          entityId,
          (entityFormCounts.get(entityId) || 0) + 1
        );
      });
    });

    // Transform to final format
    return Array.from(entityFormCounts.entries())
      .map(([entityId, count]) => ({
        entityName: entityMap.get(entityId) || 'Unknown Entity',
        formCount: count
      }))
      .sort((a, b) => b.formCount - a.formCount);
  }, [formsData?.data, purposesData?.data, entitiesData?.data]);

  // Set app versions
  useEffect(() => {
    setAppVersionsData(['1.0.0', '1.1.0', '1.2.0', '2.0.0']);
  }, []);

  // Calculate forms permissions data
  useEffect(() => {
    if (formsData?.data) {
      const permissionsData = formsData.data
        .map(form => ({
          formName: form.form_name || 'Unnamed Form',
          permissionCount: form.permissions ? 
            (typeof form.permissions === 'string' ? 
              JSON.parse(form.permissions).length : 
              form.permissions.length) : 0
        }))
        .sort((a, b) => b.permissionCount - a.permissionCount);

      setFormsPermissionsData(permissionsData);
    }
  }, [formsData?.data]);

  // Calculate consent trends
  useEffect(() => {
    if (consentsData?.data) {
      const trendMap = new Map<string, { GRANTED: number; PENDING: number; REVOKED: number }>();
      
      consentsData.data.forEach(consent => {
        const date = new Date(consent.consent_date).toISOString().split('T')[0];
        const status = consent.consent_status || 'PENDING';
        
        if (!trendMap.has(date)) {
          trendMap.set(date, { GRANTED: 0, PENDING: 0, REVOKED: 0 });
        }
        
        const currentCount = trendMap.get(date)!;
        currentCount[status as keyof typeof currentCount]++;
      });

      const sortedTrends = Array.from(trendMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, counts]) => ({
          date,
          ...counts
        }));

      setConsentTrendsData(sortedTrends);
    }
  }, [consentsData?.data]);

  return {
    aggregateData,
    consentStatusData,
    appVersionsData,
    formsEntityData: transformedFormsEntityData,
    formsPermissionsData,
    consentTrendsData,
    isLoading: isLoadingConsents || isLoadingPurposes || isLoadingForms || isLoadingEntities
  };
};
