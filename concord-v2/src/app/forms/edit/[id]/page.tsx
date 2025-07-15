"use client";

import { useForm } from "@refinedev/react-hook-form";
import { useSelect, useShow } from "@refinedev/core";
import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
  FormHelperText,
  Chip,
} from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { PermissionSelector } from "@/components/forms/PermissionSelector";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false
});

interface IFormValues {
  form_name: string;
  endpoint: string;
  subject_identifier_type?: string;
  consent_field_type?: string;
  consent_purpose_type?: string;
  form_trigger_type?: string;
  expiration_duration?: number;
  json_configuration: string;
  form_owner_primary: string;
  form_owner_secondary?: string;
  purpose_ids: string[];
  form_type: 'web' | 'mobile';
  permissions: string;
}

interface FormSection {
  title: string;
  questions: Array<{
    label: string;
    type: string;
    description?: string;
  }>;
}

interface FormConfiguration {
  sections?: FormSection[];
}

export default function FormEdit() {
  const [activeTab, setActiveTab] = useState(0);
  const params = useParams();
  
  const {
    saveButtonProps,
    register,
    control,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<IFormValues>({
    refineCoreProps: {
      resource: "forms",
      id: params?.id as string,
      action: "edit",
      redirect: false,
      onMutationSuccess: (data: any) => {
        const permissions = getValues("permissions");
        const purpose_ids = getValues("purpose_ids");

        try {
          const parsedPermissions = JSON.parse(permissions || "[]");
          data.permissions = JSON.stringify(Array.isArray(parsedPermissions) ? parsedPermissions : []);
          
          data.purpose_ids = Array.isArray(purpose_ids) ? purpose_ids : [];
        } catch (e) {
          data.permissions = "[]";
          data.purpose_ids = [];
        }
        return data;
      },
    },
  });

  const { queryResult } = useShow({
    resource: "forms",
    id: params?.id as string,
  });

  useEffect(() => {
    const record = queryResult.data?.data;
    if (record) {
      Object.keys(record).forEach((key) => {
        if (key === 'purpose_ids') {
          const purposeIds = record[key];
          setValue('purpose_ids', Array.isArray(purposeIds) ? purposeIds : 
            typeof purposeIds === 'string' ? purposeIds.split(',').filter(Boolean) : []);
        } else {
          setValue(key as any, record[key]);
        }
      });
      
      // Format JSON configuration if it exists
      if (record.json_configuration) {
        try {
          const formattedJson = JSON.stringify(JSON.parse(record.json_configuration), null, 2);
          setValue('json_configuration', formattedJson);
        } catch (e) {
          console.error('Error parsing JSON configuration:', e);
        }
      }

      // Format permissions if it exists
      if (record.permissions) {
        try {
          const formattedPermissions = JSON.stringify(JSON.parse(record.permissions), null, 2);
          setValue('permissions', formattedPermissions);
        } catch (e) {
          console.error('Error parsing permissions:', e);
          setValue('permissions', '[]');
        }
      } else {
        setValue('permissions', '[]');
      }
    }
  }, [queryResult.data, setValue]);

  // Fetch purposes for dropdown
  const { options: purposeOptions } = useSelect({
    resource: "purpose",
    optionLabel: "purpose",
    optionValue: "id",
  });

  const parseJsonConfiguration = (jsonConfiguration: string): FormConfiguration | null => {
    try {
      return JSON.parse(jsonConfiguration);
    } catch (e) {
      return null;
    }
  };

  const FormSection = ({ section }: { section: FormSection }) => {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {section.title}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {section.questions?.map((question, idx: number) => (
          <Box key={idx} sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              {question.label}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Tabs
                value={activeTab}
                onChange={(event, newValue) => setActiveTab(newValue)}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Basic Information" value={0} />
                <Tab label="Configuration" value={1} />
                <Tab label="Permissions" value={2} />
              </Tabs>

              {activeTab === 0 && (
                <Box mt={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        {...register("form_name", {
                          required: "Form name is required",
                        })}
                        error={!!errors.form_name}
                        helperText={errors.form_name?.message as string}
                        fullWidth
                        label="Form Name"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        {...register("endpoint", {
                          required: "Endpoint is required",
                        })}
                        error={!!errors.endpoint}
                        helperText={errors.endpoint?.message as string}
                        fullWidth
                        label="Endpoint"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        {...register("subject_identifier_type")}
                        fullWidth
                        label="Subject Identifier Type"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        {...register("consent_field_type")}
                        fullWidth
                        label="Consent Field Type"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        {...register("consent_purpose_type")}
                        fullWidth
                        label="Consent Purpose Type"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        {...register("form_trigger_type")}
                        fullWidth
                        label="Form Trigger Type"
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeTab === 1 && (
                <Box mt={2}>
                  <Grid container spacing={2}>
                    {/* JSON Configuration */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        Configuration
                      </Typography>
                      <Controller
                        control={control}
                        name="json_configuration"
                        rules={{ 
                          required: "Configuration is required",
                          validate: {
                            validJson: (value) => {
                              try {
                                JSON.parse(value);
                                return true;
                              } catch (e) {
                                return "Invalid JSON format";
                              }
                            }
                          }
                        }}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.json_configuration}>
                            <MonacoEditor
                              height="500px"
                              language="json"
                              theme="vs-dark"
                              value={field.value}
                              onChange={(value) => field.onChange(value || "{}")}
                              options={{
                                minimap: { enabled: false },
                                formatOnPaste: true,
                                formatOnType: true,
                                tabSize: 2,
                              }}
                            />
                            {errors.json_configuration && (
                              <FormHelperText>{errors.json_configuration.message as string}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>

                    {/* Preview */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        Preview
                      </Typography>
                      <Paper 
                        elevation={0} 
                        variant="outlined" 
                        sx={{ 
                          p: 3,
                          height: '500px',
                          overflowY: 'auto'
                        }}
                      >
                        {watch('json_configuration') ? (
                          <>
                            <Typography variant="h5" gutterBottom align="center">
                              {watch('form_name')}
                            </Typography>
                            <Divider sx={{ mb: 3 }} />

                            {(() => {
                              try {
                                const config = parseJsonConfiguration(watch('json_configuration'));
                                return config?.sections?.map((section: FormSection, idx: number) => (
                                  <FormSection key={idx} section={section} />
                                ));
                              } catch (e) {
                                return (
                                  <Typography color="error" align="center">
                                    Invalid JSON Configuration
                                  </Typography>
                                );
                              }
                            })()}
                          </>
                        ) : (
                          <Typography color="text.secondary" align="center">
                            No form configuration available
                          </Typography>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>

                  <Typography variant="subtitle1" color="primary" gutterBottom sx={{ mt: 4 }}>
                    Advanced Settings
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Form Type</InputLabel>
                        <Select
                          {...register("form_type")}
                          defaultValue="web"
                        >
                          <MenuItem value="web">Web</MenuItem>
                          <MenuItem value="mobile">Mobile</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        {...register("expiration_duration", {
                          valueAsNumber: true,
                        })}
                        type="number"
                        fullWidth
                        label="Expiration Duration (days)"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        {...register("form_owner_primary", {
                          required: "Primary owner is required"
                        })}
                        fullWidth
                        label="Primary Owner"
                        error={!!errors.form_owner_primary}
                        helperText={errors.form_owner_primary?.message as string}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        {...register("form_owner_secondary")}
                        fullWidth
                        label="Secondary Owner"
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeTab === 2 && (
                <Box mt={2}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Form Permissions
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Select or add permissions for this form. Common Android and iOS permissions are available as suggestions.
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Controller
                        control={control}
                        name="permissions"
                        defaultValue="[]"
                        rules={{
                          validate: {
                            validJson: (value) => {
                              try {
                                return true;
                              } catch (e) {
                                return "Invalid permissions format";
                              }
                            }
                          }
                        }}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.permissions}>
                            <Box sx={{ mt: 1, mb: 2 }}>
                              <PermissionSelector
                                value={(() => {
                                  try {
                                    return Array.isArray(field.value) ? field.value : 
                                           typeof field.value === 'string' ? JSON.parse(field.value) : [];
                                  } catch (e) {
                                    return [];
                                  }
                                })()}
                                onChange={(newValue) => {
                                  field.onChange(JSON.stringify(newValue));
                                }}
                              />
                            </Box>
                            {errors.permissions && (
                              <FormHelperText>{errors.permissions.message as string}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>Purpose Selection</Typography>
            <FormControl fullWidth>
              <InputLabel>Select Purposes</InputLabel>
              <Select
                {...register("purpose_ids")}
                multiple
                value={watch("purpose_ids") || []}
                onChange={(e) => setValue("purpose_ids", e.target.value as string[])}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => {
                      const purpose = purposeOptions?.find(p => p.value === value);
                      return (
                        <Chip 
                          key={value} 
                          label={purpose?.label || value} 
                          size="small"
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {purposeOptions?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </Grid>
      </Grid>
    </Edit>
  );
}
