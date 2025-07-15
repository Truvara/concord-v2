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
import { Edit } from "@refinedev/mui";
import { useParams } from "next/navigation";
import { Autocomplete } from "@mui/material";

export default function NoticeEdit() {
  const params = useParams();
  
  const {
    saveButtonProps,
    register,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    refineCoreProps: {
      resource: "notice",
      id: params?.id as string,
      action: "edit",
      redirect: false,
      meta: {
        fields: [
          "id",
          "name",
          "status",
          "published_date",
          "version",
          "notice_links",
          "managing_organization",
          "co_owners",
          "approvers",
        ],
      },
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Edit Notice</Typography>
          
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
                  value={watch("co_owners") || []}
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
                  value={watch("approvers") || []}
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
    </Edit>
  );
}
