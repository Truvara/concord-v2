"use client";

import { useForm } from "@refinedev/react-hook-form";
import { useSelect } from "@refinedev/core";
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
import { Create } from "@refinedev/mui";
import { useState } from "react";
import { Controller } from "react-hook-form";
import dynamic from "next/dynamic";
import { useEffect } from "react";
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
  }>;
}

interface FormConfiguration {
  sections?: FormSection[];
}

const parseJsonConfiguration = (jsonString: string): FormConfiguration => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON configuration:', error);
    return {};
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

export default function FormCreate() {
  const [activeTab, setActiveTab] = useState(0);
  
  const {
    saveButtonProps,
    register,
    control,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm<IFormValues>({
    refineCoreProps: {
      resource: "forms",
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
    defaultValues: {
      form_type: "web",
      json_configuration: "{}",
      permissions: "[]",
      purpose_ids: [],
    }
  });

  // Only fetch purposes
  const { options: purposeOptions } = useSelect({
    resource: "purpose",
    optionLabel: "purpose",
    optionValue: "id",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
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
                    <Grid item xs={12} sm={6}>
                      <TextField
                        {...register("purpose_ids")}
                        fullWidth
                        label="Purpose IDs"
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
                                return config?.sections?.map((section, idx) => (
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
    </Create>
  );
}
