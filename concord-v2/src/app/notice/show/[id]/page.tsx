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
  Divider,
} from "@mui/material";
import { Show } from "@refinedev/mui";
import { useParams } from "next/navigation";

interface INotice {
  id: string;
  name: string;
  status: 'draft' | 'published';
  published_date: string;
  version: string;
  notice_links: any;
  managing_organization: any;
  co_owners: string[];
  approvers: string[];
}

export default function NoticeShow() {
  const params = useParams();
  const id = params?.id?.toString() || "";

  const { queryResult } = useShow<INotice>({
    resource: "notice",
    id,
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
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  if (isLoading) {
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
    <Show>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Notice Details</Typography>
          
          {/* Basic Information Section */}
          <Box mb={4}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Notice Name</Typography>
                <Typography variant="body1" gutterBottom>{record.name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip 
                  label={record.status}
                  color={record.status === 'published' ? 'success' : 'default'}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Version</Typography>
                <Typography variant="body1">{record.version || '-'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Published Date</Typography>
                <Typography variant="body1">
                  {record.published_date ? new Date(record.published_date).toLocaleString() : '-'}
                </Typography>
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
                <Typography variant="subtitle2" color="text.secondary">Co-owners</Typography>
                <Box display="flex" gap={1} flexWrap="wrap" sx={{ mt: 1 }}>
                  {record.co_owners?.map((owner, index) => (
                    <Chip key={index} label={owner} size="small" />
                  )) || '-'}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Approvers</Typography>
                <Box display="flex" gap={1} flexWrap="wrap" sx={{ mt: 1 }}>
                  {record.approvers?.map((approver, index) => (
                    <Chip key={index} label={approver} size="small" />
                  )) || '-'}
                </Box>
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
                <Typography variant="subtitle2" color="text.secondary">Notice Links</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {record.notice_links ? JSON.stringify(record.notice_links, null, 2) : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Managing Organization</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {record.managing_organization ? JSON.stringify(record.managing_organization, null, 2) : '-'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Show>
  );
}
