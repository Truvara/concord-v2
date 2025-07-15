"use client";

import React, { useEffect } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { useSelect, useOne } from "@refinedev/core";
import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Divider,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useParams } from "next/navigation";

interface IForm {
  id: string;
  form_name: string;
  endpoint: string;
  form_type: string;
  json_configuration: any;
}

interface IPurpose {
  id: string;
  purpose: string;
  purpose_category: string;
  purpose_description: string;
}

export default function ConsentEdit() {
  const params = useParams();
  const id = params?.id?.toString() || "";
  
  // Get the consent record data
  const { data: consentData, isLoading: isLoadingConsent } = useOne({
    resource: "consents",
    id,
    meta: {
      fields: [
        "id",
        "subject_identity",
        "geolocation",
        "consent_status",
        "consent_date",
        "consent_collected",
        "form_id",
        "purpose_id",
        "created_at",
        "updated_at",
      ],
    },
  });
  
  const {
    saveButtonProps,
    register,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm({
    refineCoreProps: {
      resource: "consents",
      id,
      action: "edit",
      redirect: false,
    },
    values: {
      ...consentData?.data,
    },
  });

  const record = consentData?.data;

  const { options: formOptions, queryResult: formQueryResult } = useSelect<IForm>({
    resource: "forms",
    optionLabel: "form_name",
    optionValue: "id",
    meta: {
      fields: ["id", "form_name", "endpoint", "form_type", "json_configuration"],
    },
    queryOptions: {
      enabled: !!record,
    }
  });

  const { options: purposeOptions, queryResult: purposeQueryResult } = useSelect<IPurpose>({
    resource: "purpose",
    optionLabel: "purpose",
    optionValue: "id",
    meta: {
      fields: ["id", "purpose", "purpose_category", "purpose_description"],
    },
    queryOptions: {
      enabled: !!record,
    }
  });

  // Format dates for datetime-local inputs only once when data is loaded
  useEffect(() => {
    if (record) {
      if (record.consent_date) {
        const date = new Date(record.consent_date);
        if (!isNaN(date.getTime())) {
          setValue('consent_date', date.toISOString().slice(0, 16));
        }
      }
      
      if (record.consent_collected) {
        const date = new Date(record.consent_collected);
        if (!isNaN(date.getTime())) {
          setValue('consent_collected', date.toISOString().slice(0, 16));
        }
      }

      // Set other fields
      setValue('subject_identity', record.subject_identity);
      setValue('consent_status', record.consent_status);
      setValue('geolocation', record.geolocation);
      setValue('form_id', record.form_id);
      setValue('purpose_id', record.purpose_id);
    }
  }, [record, setValue]);

  const selectedFormId = watch("form_id");
  const selectedPurposeId = watch("purpose_id");
  const consentStatus = watch("consent_status");

  const selectedForm = formQueryResult.data?.data?.find(item => item.id === selectedFormId);
  const selectedPurpose = purposeQueryResult.data?.data?.find(item => item.id === selectedPurposeId);

  if (isLoadingConsent || formQueryResult.isLoading || purposeQueryResult.isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Edit Consent</Typography>
              
              <Box mb={4}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      {...register("subject_identity", { required: "This field is required" })}
                      error={!!errors?.subject_identity}
                      helperText={errors?.subject_identity?.message as string}
                      fullWidth
                      label="Subject Identity"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register("consent_status")}
                      select
                      fullWidth
                      label="Status"
                      margin="normal"
                      value={consentStatus || ""}
                    >
                      <MenuItem value="GRANTED">Granted</MenuItem>
                      <MenuItem value="REVOKED">Revoked</MenuItem>
                      <MenuItem value="PENDING">Pending</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register("geolocation")}
                      fullWidth
                      label="Location"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      {...register("form_id")}
                      select
                      fullWidth
                      label="Form"
                      margin="normal"
                      value={selectedFormId || ""}
                    >
                      {formOptions?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      {...register("purpose_id")}
                      select
                      fullWidth
                      label="Purpose"
                      margin="normal"
                      value={selectedPurposeId || ""}
                    >
                      {purposeOptions?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      {...register("consent_date")}
                      type="datetime-local"
                      fullWidth
                      label="Consent Date"
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      inputProps={{
                        step: 1, // This allows seconds in the time picker
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      {...register("consent_collected")}
                      type="datetime-local"
                      fullWidth
                      label="Collection Date"
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      inputProps={{
                        step: 1, // This allows seconds in the time picker
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          {selectedForm && (
            <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>Selected Form</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" color="text.secondary">Form Name</Typography>
              <Typography variant="body1" gutterBottom>{selectedForm.form_name}</Typography>
              <Typography variant="subtitle2" color="text.secondary">Endpoint</Typography>
              <Typography variant="body1" gutterBottom>{selectedForm.endpoint}</Typography>
              <Typography variant="subtitle2" color="text.secondary">Type</Typography>
              <Typography variant="body1">{selectedForm.form_type}</Typography>
            </Paper>
          )}

          {selectedPurpose && (
            <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Selected Purpose</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" color="text.secondary">Purpose</Typography>
              <Typography variant="body1" gutterBottom>{selectedPurpose.purpose}</Typography>
              <Typography variant="subtitle2" color="text.secondary">Description</Typography>
              <Typography variant="body1" gutterBottom>{selectedPurpose.purpose_description}</Typography>
              <Typography variant="subtitle2" color="text.secondary">Category</Typography>
              <Typography variant="body1">{selectedPurpose.purpose_category}</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Edit>
  );
}
