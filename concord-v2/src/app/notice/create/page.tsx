"use client";

import { useForm } from "@refinedev/react-hook-form";
import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  MenuItem,
  Divider,
} from "@mui/material";
import { Create } from "@refinedev/mui";
import { Autocomplete } from "@mui/material";

export default function NoticeCreate() {
  const {
    saveButtonProps,
    register,
    formState: { errors },
    setValue,
  } = useForm({
    refineCoreProps: {
      resource: "notice",
      redirect: false,
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Create Notice</Typography>
          
          {/* Basic Information Section */}
          <Box mb={4}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  {...register("name", { required: "This field is required" })}
                  error={!!errors?.name}
                  helperText={errors?.name?.message as string}
                  fullWidth
                  label="Notice Name"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register("status")}
                  select
                  fullWidth
                  label="Status"
                  defaultValue="draft"
                  margin="normal"
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register("version")}
                  fullWidth
                  label="Version"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("published_date")}
                  type="datetime-local"
                  fullWidth
                  label="Published Date"
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Organization Details Section */}
          <Box mb={4}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Organization Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={[]}
                  freeSolo
                  onChange={(_, value) => setValue("co_owners", value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...register("co_owners")}
                      label="Co-owners"
                      margin="normal"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={[]}
                  freeSolo
                  onChange={(_, value) => setValue("approvers", value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...register("approvers")}
                      label="Approvers"
                      margin="normal"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Additional Information Section */}
          <Box>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Additional Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  {...register("notice_links")}
                  fullWidth
                  label="Notice Links (JSON)"
                  multiline
                  rows={4}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("managing_organization")}
                  fullWidth
                  label="Managing Organization (JSON)"
                  multiline
                  rows={4}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Create>
  );
}
