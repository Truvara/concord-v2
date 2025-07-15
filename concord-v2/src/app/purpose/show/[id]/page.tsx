"use client";

import { useShow, BaseKey } from "@refinedev/core";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import { Show, EditButton } from "@refinedev/mui";
import { useParams } from "next/navigation";
import { useList } from "@refinedev/core";

interface IPurpose {
  id: string;
  entity_id: string;
  purpose: string;
  purpose_duration: number;
  processing_purpose: string;
  is_mandatory: boolean;
  is_reconsent_by_principal: boolean;
  is_revocable_by_principal: boolean;
  purpose_description: string | null;
  purpose_category: string | null;
  frequency_interval: number | null;
  expiration_date: string | null;
  data_types: string[] | null;
  third_party_sharing: boolean | null;
  retention_period: number | null;
  last_updated: string | null;
  created_at: string | null;
  entity_ids: string[];
}

interface IEntity {
  id: string;
  entity_name: string;
  entity_description: string;
  line_of_business: string;
  consent_poc: string | null;
}

export default function PurposeShow() {
  const params = useParams();
  const id = params?.id?.toString() || "";

  const { queryResult } = useShow<IPurpose>({
    resource: "purpose",
    id,
    meta: {
      fields: [
        "id",
        "entity_id",
        "purpose",
        "purpose_duration",
        "processing_purpose",
        "is_mandatory",
        "is_reconsent_by_principal",
        "is_revocable_by_principal",
        "purpose_description",
        "purpose_category",
        "frequency_interval",
        "expiration_date",
        "data_types",
        "third_party_sharing",
        "retention_period",
        "last_updated",
        "created_at",
        "entity_ids",
      ],
    },
  });

  // Fetch entity details
  const { data: entitiesData } = useList({
    resource: "entity",
    filters: [
      {
        field: "id",
        operator: "in",
        value: queryResult.data?.data?.entity_ids || [],
      },
    ],
    queryOptions: {
      enabled: !!queryResult.data?.data?.entity_ids?.length,
    },
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!record) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>No data found</Typography>
      </Box>
    );
  }

  return (
    <Show
      headerButtons={[
        <EditButton key="edit" recordItemId={id as BaseKey} />
      ]}
      isLoading={isLoading}
    >
      <Grid container spacing={2}>
        {/* Main Content - Left Side */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Purpose Details</Typography>
              
              {/* Basic Information Section */}
              <Box mb={4}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Purpose</Typography>
                    <Typography variant="body1">{record.purpose}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                    <Typography variant="body1">{record.purpose_description || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                    <Typography variant="body1">{record.purpose_category || '-'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
                    <Typography variant="body1">{record.purpose_duration} months</Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Processing Details Section */}
              <Box mb={4}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Processing Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Processing Purpose</Typography>
                    <Typography variant="body1">{record.processing_purpose}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Frequency Interval</Typography>
                    <Typography variant="body1">
                      {record.frequency_interval ? `${record.frequency_interval} days` : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Retention Period</Typography>
                    <Typography variant="body1">
                      {record.retention_period ? `${record.retention_period} days` : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Expiration Date</Typography>
                    <Typography variant="body1">
                      {record.expiration_date ? new Date(record.expiration_date).toLocaleDateString() : '-'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Settings Section */}
              <Box>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Settings & Configurations
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Chip 
                        label={record.is_mandatory ? "Mandatory" : "Optional"}
                        color={record.is_mandatory ? "primary" : "default"}
                      />
                      <Chip 
                        label={record.is_reconsent_by_principal ? "Reconsent Required" : "No Reconsent"}
                        color={record.is_reconsent_by_principal ? "primary" : "default"}
                      />
                      <Chip 
                        label={record.is_revocable_by_principal ? "Revocable" : "Not Revocable"}
                        color={record.is_revocable_by_principal ? "primary" : "default"}
                      />
                      <Chip 
                        label={record.third_party_sharing ? "Third Party Sharing" : "No Third Party Sharing"}
                        color={record.third_party_sharing ? "primary" : "default"}
                      />
                    </Box>
                  </Grid>
                  {record.data_types && record.data_types.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Data Types</Typography>
                      <Box display="flex" gap={1} flexWrap="wrap" sx={{ mt: 1 }}>
                        {record.data_types.map((type: string) => (
                          <Chip key={type} label={type} variant="outlined" />
                        ))}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Entity Information - Right Side */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Associated Entities</Typography>
            <Divider sx={{ mb: 2 }} />
            
            {entitiesData?.data?.length ? (
              <Box>
                {entitiesData.data.map((entity) => (
                  <Box key={entity.id} mb={3}>
                    <Typography variant="subtitle2" color="text.secondary">Entity Name</Typography>
                    <Typography variant="body1" gutterBottom>{entity.entity_name}</Typography>
                    
                    <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                    <Typography variant="body1" gutterBottom>{entity.entity_description}</Typography>
                    
                    <Typography variant="subtitle2" color="text.secondary">Line of Business</Typography>
                    <Typography variant="body1" gutterBottom>{entity.line_of_business}</Typography>
                    
                    <Typography variant="subtitle2" color="text.secondary">Consent POC</Typography>
                    <Typography variant="body1">{entity.consent_poc || '-'}</Typography>
                    
                    {entity.id !== entitiesData.data[entitiesData.data.length - 1].id && (
                      <Divider sx={{ my: 2 }} />
                    )}
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">No entities associated</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Show>
  );
}
