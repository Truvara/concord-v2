"use client";

import { useForm } from "@refinedev/react-hook-form";
import { useList } from "@refinedev/core";
import {
  Box,
  TextField,
  FormControl,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Divider,
  Autocomplete,
} from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useParams } from "next/navigation";

interface IPurposeForm {
  purpose: string;
  purpose_description?: string;
  purpose_duration: number;
  processing_purpose: string;
  is_mandatory: boolean;
  is_reconsent_by_principal: boolean;
  is_revocable_by_principal: boolean;
  purpose_category?: string;
  frequency_interval?: number;
  expiration_date?: string;
  data_types?: string[];
  third_party_sharing: boolean;
  retention_period?: number;
  entity_ids: string[];
}

const formatDateForInput = (date: string | null) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

export default function PurposeEdit() {
  const params = useParams();
  
  const {
    saveButtonProps,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm<IPurposeForm>({
    refineCoreProps: {
      resource: "purpose",
      id: params?.id as string,
      action: "edit",
      redirect: false,
      meta: {
        fields: [
          "id",
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
          "entity_ids",
        ],
      },
    },
    defaultValues: {
      entity_ids: [],
    },
  });

  const { data: entityListData } = useList({
    resource: "entity",
    pagination: { mode: "off" },
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Grid container spacing={2}>
        {/* Main Form - Left Side */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Edit Purpose</Typography>
              
              {/* Basic Information Section */}
              <Box mb={4}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      {...register("purpose", { required: "This field is required" })}
                      error={!!errors?.purpose}
                      helperText={errors?.purpose?.message as string}
                      fullWidth
                      label="Purpose"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register("purpose_description")}
                      fullWidth
                      label="Description"
                      multiline
                      rows={4}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      {...register("purpose_category")}
                      fullWidth
                      label="Category"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      {...register("purpose_duration", {
                        valueAsNumber: true,
                        required: "This field is required",
                      })}
                      type="number"
                      fullWidth
                      label="Duration (months)"
                      margin="normal"
                    />
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
                    <TextField
                      {...register("processing_purpose", {
                        required: "This field is required",
                      })}
                      error={!!errors?.processing_purpose}
                      helperText={errors?.processing_purpose?.message as string}
                      fullWidth
                      label="Processing Purpose"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      {...register("frequency_interval", { valueAsNumber: true })}
                      type="number"
                      fullWidth
                      label="Frequency Interval (days)"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      {...register("retention_period", { valueAsNumber: true })}
                      type="number"
                      fullWidth
                      label="Retention Period (days)"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register("expiration_date", {
                        setValueAs: (value) => value ? new Date(value).toISOString() : null,
                      })}
                      type="date"
                      fullWidth
                      label="Expiration Date"
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      defaultValue={formatDateForInput(watch('expiration_date'))}
                    />
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
                    <FormControl component="fieldset" margin="normal">
                      <FormControlLabel
                        control={
                          <Switch {...register("is_mandatory")} />
                        }
                        label="Mandatory"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl component="fieldset" margin="normal">
                      <FormControlLabel
                        control={
                          <Switch {...register("is_reconsent_by_principal")} />
                        }
                        label="Reconsent by Principal Required"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl component="fieldset" margin="normal">
                      <FormControlLabel
                        control={
                          <Switch {...register("is_revocable_by_principal")} />
                        }
                        label="Revocable by Principal"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl component="fieldset" margin="normal">
                      <FormControlLabel
                        control={
                          <Switch {...register("third_party_sharing")} />
                        }
                        label="Third Party Sharing"
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Entity Information - Right Side */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Entity Selection</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box>
              <Autocomplete
                multiple
                options={entityListData?.data || []}
                getOptionLabel={(option) => option.entity_name}
                value={(entityListData?.data || []).filter(entity => 
                  watch('entity_ids')?.includes(entity.id)
                )}
                onChange={(_, newValue) => {
                  const entityIds = newValue.map(entity => entity.id);
                  setValue("entity_ids", entityIds);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={!!errors?.entity_ids}
                    helperText={errors?.entity_ids?.message as string}
                    label="Select Entities"
                    margin="normal"
                  />
                )}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Edit>
  );
}
