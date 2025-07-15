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
import { useOne } from "@refinedev/core";

interface IConsent {
  id: string;
  subject_identity: string;
  geolocation: string | null;
  consent_status: "GRANTED" | "REVOKED" | "PENDING";
  consent_date: string;
  consent_collected: string;
  form_id: string;
  purpose_id: string;
  created_at: string;
  updated_at: string;
}

interface IForm {
  id: string;
  form_name: string;
  json_configuration: any;
  endpoint: string;
  form_type: string;
}

interface IPurpose {
  id: string;
  purpose: string;
  purpose_description: string;
  purpose_category: string;
}

export default function ConsentShow() {
  const params = useParams();
  const id = params?.id?.toString() || "";

  const { queryResult } = useShow<IConsent>({
    resource: "consents",
    id,
  });

  const { data: consentData, isLoading: isLoadingConsent } = queryResult;
  const record = consentData?.data;

  const { data: formData, isLoading: isLoadingForm } = useOne<IForm>({
    resource: "forms",
    id: record?.form_id || "",
    queryOptions: {
      enabled: !!record?.form_id,
    },
    meta: {
      fields: ["id", "form_name", "json_configuration", "endpoint", "form_type"],
    },
  });

  const { data: purposeData, isLoading: isLoadingPurpose } = useOne<IPurpose>({
    resource: "purpose",
    id: record?.purpose_id || "",
    queryOptions: {
      enabled: !!record?.purpose_id,
    },
  });

  const form = formData?.data;
  const purpose = purposeData?.data;

  if (isLoadingConsent || isLoadingForm || isLoadingPurpose) {
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
      isLoading={isLoadingConsent || isLoadingForm || isLoadingPurpose}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Consent Details</Typography>
              
              <Box mb={4}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Subject Identity</Typography>
                    <Typography variant="body1">{record.subject_identity}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                    <Chip 
                      label={record.consent_status}
                      color={
                        record.consent_status === "GRANTED" ? "success" :
                        record.consent_status === "REVOKED" ? "error" : "warning"
                      }
                      sx={{ mt: 1 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Consent Date</Typography>
                    <Typography variant="body1">
                      {new Date(record.consent_date).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Collected At</Typography>
                    <Typography variant="body1">
                      {new Date(record.consent_collected).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                    <Typography variant="body1">{record.geolocation || '-'}</Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Timestamps
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
                    <Typography variant="body1">
                      {new Date(record.created_at).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Updated At</Typography>
                    <Typography variant="body1">
                      {new Date(record.updated_at).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>Form Information</Typography>
            <Divider sx={{ mb: 2 }} />
            
            {form ? (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Form Name</Typography>
                <Typography variant="body1" gutterBottom>{form.form_name}</Typography>
                
                <Typography variant="subtitle2" color="text.secondary">Endpoint</Typography>
                <Typography variant="body1" gutterBottom>{form.endpoint}</Typography>
                
                <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                <Typography variant="body1">{form.form_type}</Typography>
              </Box>
            ) : (
              <Typography color="text.secondary">No form information available</Typography>
            )}
          </Paper>

          <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Purpose Information</Typography>
            <Divider sx={{ mb: 2 }} />
            
            {purpose ? (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Purpose</Typography>
                <Typography variant="body1" gutterBottom>{purpose.purpose}</Typography>
                
                <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                <Typography variant="body1" gutterBottom>{purpose.purpose_description}</Typography>
                
                <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                <Typography variant="body1">{purpose.purpose_category}</Typography>
              </Box>
            ) : (
              <Typography color="text.secondary">No purpose information available</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Show>
  );
}
