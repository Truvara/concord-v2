"use client";

import { useShow, useOne, useMany } from "@refinedev/core";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Divider,
  Tab,
  Tabs,
  Chip,
  FormControl,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { Show } from "@refinedev/mui";
import { useParams } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import { PermissionSelector } from "@/components/forms/PermissionSelector";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false
});

interface FormElementOption {
  label: string;
  value: string | number;
}

interface FormElementBase {
  type: 'text' | 'checkbox' | 'radio' | 'select' | 'heading' | 'paragraph';
  label?: string;
  placeholder?: string;
  options?: FormElementOption[];
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text?: string;
}

interface FormSection {
  title?: string;
  elements?: FormElementBase[];
}

interface FormConfiguration {
  sections?: FormSection[];
}

// Helper component to render form elements based on type
const FormElement = ({ element }: { element: FormElementBase }) => {
  switch (element.type) {
    case 'text':
      return (
        <TextField
          fullWidth
          label={element.label}
          placeholder={element.placeholder}
          disabled
          sx={{ mb: 2 }}
        />
      );
    
    case 'checkbox':
      return (
        <FormControlLabel
          control={<Checkbox disabled />}
          label={element.label}
          sx={{ mb: 2 }}
        />
      );
    
    case 'radio':
      return (
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>{element.label}</Typography>
          <RadioGroup>
            {element.options?.map((option, idx) => (
              <FormControlLabel
                key={idx}
                value={option.value}
                control={<Radio disabled />}
                label={option.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      );
    
    case 'select':
      return (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>{element.label}</InputLabel>
          <Select
            label={element.label}
            disabled
          >
            {element.options?.map((option, idx) => (
              <MenuItem key={idx} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    
    case 'heading':
      return (
        <Typography 
          variant={element.variant || 'h6'} 
          gutterBottom 
          sx={{ mb: 2 }}
        >
          {element.text}
        </Typography>
      );
    
    case 'paragraph':
      return (
        <Typography 
          variant="body1" 
          gutterBottom 
          sx={{ mb: 2 }}
        >
          {element.text}
        </Typography>
      );

    default:
      return null;
  }
};

// Helper component to render form sections
const FormSection = ({ section }: { section: FormSection }) => {
  return (
    <Box sx={{ mb: 4 }}>
      {section.title && (
        <>
          <Typography variant="h6" color="primary" gutterBottom>
            {section.title}
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </>
      )}
      {section.elements?.map((element, idx) => (
        <FormElement key={idx} element={element} />
      ))}
    </Box>
  );
};

export default function FormShow() {
  const [activeTab, setActiveTab] = useState(0);
  const params = useParams();

  const { queryResult } = useShow({
    resource: "forms",
    id: params?.id as string,
  });

  // Fetch related purpose details
  const { data: purposesData } = useMany({
    resource: "purpose",
    ids: queryResult.data?.data?.purpose_ids || [],
    queryOptions: {
      enabled: !!queryResult.data?.data?.purpose_ids?.length,
    },
  });

  // Fetch related entity details
  const { data: entityData } = useOne({
    resource: "entity",
    id: queryResult.data?.data?.entity_id || "",
    queryOptions: {
      enabled: !!queryResult.data?.data?.entity_id,
    },
  });

  const record = queryResult.data?.data;
  const purposes = purposesData?.data;
  const entity = entityData?.data;

  const parseJsonConfiguration = (jsonString: string): FormConfiguration => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON configuration:', error);
      return {};
    }
  };

  const formatJsonConfiguration = (jsonString: string): string => {
    try {
      // First parse the JSON string to remove escape characters
      const parsedJson = JSON.parse(jsonString);
      // Then stringify it back with proper formatting
      return JSON.stringify(parsedJson, null, 2);
    } catch (error) {
      console.error('Error formatting JSON configuration:', error);
      return jsonString || "{}";
    }
  };

  return (
    <Show>
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
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Form Name</Typography>
                      <Typography variant="body1">{record?.form_name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Endpoint</Typography>
                      <Typography variant="body1">{record?.endpoint}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Subject Identifier Type</Typography>
                      <Typography variant="body1">{record?.subject_identifier_type || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Consent Field Type</Typography>
                      <Typography variant="body1">{record?.consent_field_type || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Consent Purpose Type</Typography>
                      <Typography variant="body1">{record?.consent_purpose_type || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Form Trigger Type</Typography>
                      <Typography variant="body1">{record?.form_trigger_type || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Purpose ID</Typography>
                      <Typography variant="body1">{record?.purpose_id || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Entity ID</Typography>
                      <Typography variant="body1">{record?.entity_id || '-'}</Typography>
                    </Grid>
                  </Grid>

                  <Typography variant="subtitle1" color="primary" gutterBottom sx={{ mt: 4 }}>
                    Advanced Settings
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Form Type</Typography>
                      <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{record?.form_type}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Expiration Duration</Typography>
                      <Typography variant="body1">{record?.expiration_duration ? `${record.expiration_duration} days` : '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Primary Owner</Typography>
                      <Typography variant="body1">{record?.form_owner_primary || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Secondary Owner</Typography>
                      <Typography variant="body1">{record?.form_owner_secondary || '-'}</Typography>
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
                      <MonacoEditor
                        height="650px"
                        language="json"
                        theme="vs-dark"
                        value={formatJsonConfiguration(record?.json_configuration || "{}")}
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          formatOnPaste: true,
                          formatOnType: true,
                          tabSize: 2,
                        }}
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
                          height: '650px',
                          overflowY: 'auto'
                        }}
                      >
                        {record?.json_configuration ? (
                          <>
                            <Typography variant="h5" gutterBottom align="center">
                              {record.form_name}
                            </Typography>
                            <Divider sx={{ mb: 3 }} />

                            {parseJsonConfiguration(record.json_configuration)?.sections?.map((section, idx) => (
                              <FormSection key={idx} section={section} />
                            ))}
                          </>
                        ) : (
                          <Typography color="text.secondary" align="center">
                            No form configuration available
                          </Typography>
                        )}
                      </Paper>
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
                    The following permissions are required for this form:
                  </Typography>
                  <Box sx={{ mt: 1, mb: 2 }}>
                    {record ? (
                      <PermissionSelector
                        value={(() => {
                          try {
                            const perms = record.permissions;
                            if (typeof perms === 'string') {
                              return JSON.parse(perms);
                            }
                            return Array.isArray(perms) ? perms : [];
                          } catch (e) {
                            return [];
                          }
                        })()}
                        onChange={() => {}}
                        disabled={true}
                      />
                    ) : null}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Purpose Information */}
          <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>Purposes Information</Typography>
            <Divider sx={{ mb: 2 }} />
            
            {purposesData?.data?.length ? (
              <Box>
                {purposesData.data.map((purpose, index) => (
                  <Box key={purpose.id} sx={{ mb: index !== purposesData.data.length - 1 ? 2 : 0 }}>
                    <Typography variant="subtitle2" color="text.secondary">Purpose {index + 1}</Typography>
                    <Typography variant="body1" gutterBottom>{purpose.purpose}</Typography>
                    
                    <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                    <Typography variant="body1" gutterBottom>{purpose.purpose_description}</Typography>
                    
                    <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
                    <Typography variant="body1">{purpose.purpose_duration} months</Typography>
                    
                    {index !== purposesData.data.length - 1 && (
                      <Divider sx={{ my: 2 }} />
                    )}
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">No purposes assigned</Typography>
            )}
          </Paper>

          {/* Entity Information */}
          <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Entity Information</Typography>
            <Divider sx={{ mb: 2 }} />
            
            {entity ? (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Entity Name</Typography>
                <Typography variant="body1" gutterBottom>{entity.entity_name}</Typography>
                
                <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                <Typography variant="body1" gutterBottom>{entity.entity_description}</Typography>
                
                <Typography variant="subtitle2" color="text.secondary">Line of Business</Typography>
                <Typography variant="body1">{entity.line_of_business}</Typography>
              </Box>
            ) : (
              <Typography color="text.secondary">No entity information available</Typography>
            )}
          </Paper>

          {/* Timestamps */}
          <Paper elevation={0} variant="outlined" sx={{ p: 2, mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
            <Typography variant="body2" gutterBottom>
              {record?.created_at ? new Date(record.created_at).toLocaleString() : '-'}
            </Typography>
            
            <Typography variant="subtitle2" color="text.secondary">Updated At</Typography>
            <Typography variant="body2">
              {record?.updated_at ? new Date(record.updated_at).toLocaleString() : '-'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Show>
  );
}
