"use client";

import { useForm } from "@refinedev/react-hook-form";
import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Tab,
  Tabs,
  FormHelperText,
  FormControl,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  InputLabel,
  Paper,
} from "@mui/material";
import { Create } from "@refinedev/mui";
import { useState, useCallback, useEffect } from "react";
import { Controller } from "react-hook-form";
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

interface IPreferenceValues {
  app_identifier: string;
  form_identifier: string;
  preference_center_version?: string;
  app_version?: string;
  form_settings?: string;
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

export default function PreferenceCreate() {
  const [activeTab, setActiveTab] = useState(0);
  const [formPreview, setFormPreview] = useState<FormConfiguration>({});
  const [isEditorReady, setIsEditorReady] = useState(false);
  
  const {
    saveButtonProps,
    register,
    control,
    formState: { errors },
    watch,
  } = useForm<IPreferenceValues>({
    refineCoreProps: {
      resource: "preferences",
      redirect: false,
    },
    defaultValues: {
      form_settings: "{}",
    }
  });

  const formSettings = watch('form_settings');

  useEffect(() => {
    try {
      const parsedForm = formSettings ? JSON.parse(formSettings) : {};
      setFormPreview(parsedForm);
    } catch (error) {
      console.error('Error parsing form settings:', error);
      setFormPreview({});
    }
  }, [formSettings]);

  const handleEditorMount: OnMount = useCallback((editor, monaco) => {
    setIsEditorReady(true);
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      folding: true,
      lineNumbers: 'on',
      wordWrap: 'on',
    });
  }, []);

  const handleEditorChange = useCallback((value: string | undefined) => {
    try {
      // Ensure we always have valid JSON
      const validJson = value || "{}";
      return validJson;
    } catch (error) {
      console.error('Error updating form settings:', error);
      return "{}";
    }
  }, []);

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
                <Tab label="Basic Information" />
                <Tab label="Configuration" />
              </Tabs>

              {activeTab === 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Preference Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        {...register("app_identifier", { 
                          required: "App identifier is required" 
                        })}
                        fullWidth
                        label="App Identifier"
                        error={!!errors.app_identifier}
                        helperText={errors.app_identifier?.message?.toString()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        {...register("form_identifier", { 
                          required: "Form identifier is required" 
                        })}
                        fullWidth
                        label="Form Identifier"
                        error={!!errors.form_identifier}
                        helperText={errors.form_identifier?.message?.toString()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        {...register("preference_center_version")}
                        fullWidth
                        label="Preference Center Version"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        {...register("app_version")}
                        fullWidth
                        label="App Version"
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeTab === 1 && (
                <Box mt={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Preference Center Outline
                      </Typography>
                      <Controller
                        control={control}
                        name="form_settings"
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.form_settings}>
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
                                value={field.value}
                                onChange={(value) => field.onChange(handleEditorChange(value))}
                                options={{
                                  minimap: { enabled: false },
                                  formatOnPaste: true,
                                  formatOnType: true,
                                }}
                                onMount={handleEditorMount}
                                loading={<Typography>Loading editor...</Typography>}
                              />
                            </Paper>
                            {errors.form_settings && (
                              <FormHelperText>{errors.form_settings.message?.toString()}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
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
                        {formSettings ? (
                          <>
                            <Typography variant="h5" gutterBottom align="center">
                              {formPreview.name || "Preference Form"}
                            </Typography>
                            <Divider sx={{ mb: 3 }} />

                            {Object.entries(formPreview.fields || {}).map(([key, element]) => (
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
    </Create>
  );
} 