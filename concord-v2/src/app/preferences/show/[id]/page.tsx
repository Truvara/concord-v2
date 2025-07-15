"use client";

import { useShow } from "@refinedev/core";
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
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { OnMount } from "@monaco-editor/react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false
});

interface FormElementOption {
  label: string;
  value: string;
  default_value?: boolean;
}

interface FormElement {
  type: string;
  label?: string;
  text?: string;
  default_value?: boolean;
  options?: FormElementOption[];
}

interface FormConfiguration {
  name?: string;
  fields?: Record<string, FormElement>;
  submit_button?: {
    text: string;
  };
}

// Helper component to render form elements based on type
const FormElement = ({ element }: { element: FormElement }) => {
  switch (element.type) {
    case 'text':
      return (
        <TextField
          fullWidth
          label={element.label}
          disabled
          sx={{ mb: 2 }}
        />
      );
    
    case 'checkbox':
      return (
        <FormControlLabel
          control={<Checkbox checked={element.default_value || false} disabled />}
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
                value={option.value.toString()}
                control={<Radio checked={option.default_value || false} disabled />}
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
            value=""
          >
            {element.options?.map((option, idx) => (
              <MenuItem key={idx} value={option.value.toString()}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );

    default:
      return null;
  }
};

export default function PreferenceShow() {
  const [activeTab, setActiveTab] = useState(0);
  const params = useParams();

  const { queryResult } = useShow({
    resource: "preferences",
    id: params?.id as string,
  });

  const record = queryResult.data?.data;

  const formatJsonField = (jsonString: string | null | undefined): string => {
    if (!jsonString) return "{}";
    try {
      const parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      console.error('Error formatting JSON:', error);
      return "{}";
    }
  };

  const parseFormConfiguration = (jsonString: string | null | undefined): FormConfiguration => {
    try {
      return typeof jsonString === 'string' ? JSON.parse(jsonString) : (jsonString || {});
    } catch (error) {
      console.error('Error parsing form configuration:', error);
      return {};
    }
  };

  const handleEditorMount: OnMount = useCallback((editor, monaco) => {
    editor.updateOptions({
      readOnly: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      folding: true,
      lineNumbers: 'on',
      renderValidationDecorations: 'off',
      wordWrap: 'on',
    });
  }, []);

  return (
    <Show>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Tabs 
                value={activeTab} 
                onChange={(_, newValue) => setActiveTab(newValue)}
              >
                <Tab label="Basic Information" />
                <Tab label="Configuration" />
              </Tabs>

              {activeTab === 0 && (
                <Box mt={2}>
                  {/* Basic Information Section */}
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Preference Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        App Identifier
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {record?.app_identifier}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Form Identifier
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {record?.form_identifier}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Preference Center Version
                      </Typography>
                      {record?.preference_center_version ? (
                        <Chip 
                          label={record.preference_center_version}
                          color="primary"
                          size="small"
                        />
                      ) : (
                        <Typography variant="body1">-</Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        App Version
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {record?.app_version || '-'}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Timestamps Section */}
                  <Box mt={4}>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      Timestamps
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Last Updated
                        </Typography>
                        <Typography variant="body1">
                          {record?.last_updated ? new Date(record.last_updated).toLocaleString() : '-'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )}

              {activeTab === 1 && (
                <Box mt={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Preference Center Outline
                      </Typography>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          height: '650px',
                          overflow: 'hidden'
                        }}
                      >
                        <MonacoEditor
                          height="650px"
                          language="json"
                          theme="vs-dark"
                          value={formatJsonField(record?.form_settings)}
                          options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                          }}
                          onMount={handleEditorMount}
                          loading={<Typography>Loading editor...</Typography>}
                        />
                      </Paper>
                    </Grid>

                    {/* Form Preview */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Form Preview
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
                        {record?.form_settings ? (
                          <>
                            <Typography variant="h5" gutterBottom align="center">
                              {parseFormConfiguration(record.form_settings).name || "Preference Form"}
                            </Typography>
                            <Divider sx={{ mb: 3 }} />

                            {Object.entries(parseFormConfiguration(record.form_settings).fields || {}).map(([key, element]) => (
                              <Box key={key}>
                                <FormElement element={element} />
                              </Box>
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Show>
  );
} 