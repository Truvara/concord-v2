"use client";

import React, { useState } from "react";
import { useDataGrid, List } from "@refinedev/mui";
import { 
  DataGrid, 
  GridColDef,
  GridDensity
} from "@mui/x-data-grid";
import { 
  Box, 
  Card, 
  IconButton, 
  Popover, 
  FormGroup, 
  FormControlLabel, 
  Checkbox,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import { 
  ViewComfy as ViewComfyIcon, 
  ViewColumn as ViewColumnIcon,
  FilterList as FilterListIcon 
} from "@mui/icons-material";
import { CrudFilters, HttpError } from "@refinedev/core";
import { useNavigation } from "@refinedev/core";

interface IConsent {
  id: string;
  subject_identity: string;
  geolocation: string | null;
  consent_status: "GRANTED" | "REVOKED" | "PENDING";
  consent_date: string;
  consent_collected: string;
  form_id: string;
  purpose_id: string;
  created_at: string;
  updated_at: string;
}

export default function ConsentList() {
  const { show } = useNavigation();
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [density, setDensity] = useState<GridDensity>('comfortable');
  const [densityAnchorEl, setDensityAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [localFilters, setLocalFilters] = useState<CrudFilters>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "subject_identity",
    "consent_status",
    "consent_date",
    "consent_collected",
    "geolocation",
  ]);

  const { dataGridProps, search } = useDataGrid<IConsent, HttpError>({
    resource: "consents",
    sorters: {
      initial: [{ field: "consent_date", order: "desc" }],
    },
    filters: {
      mode: "server",
      defaultBehavior: "replace",
      permanent: localFilters,
    },
    pagination: {
      pageSize: 20,
    },
    onSearch: (value) => {
      const filters: CrudFilters = [];
      if (value) {
        filters.push({
          operator: "or",
          value: [
            { field: "subject_identity", operator: "contains", value },
            { field: "geolocation", operator: "contains", value },
          ],
        });
      }
      return filters;
    },
  });

  const columns: GridColDef<IConsent>[] = [
    {
      field: "subject_identity",
      headerName: "Subject Identity",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box
          sx={{
            cursor: 'pointer',
            color: 'primary.main',
            '&:hover': { textDecoration: 'underline' }
          }}
          onClick={() => show("consents", params.row.id)}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "consent_status",
      headerName: "Status",
      flex: 0.7,
      minWidth: 120,
      renderCell: (params) => {
        const statusColors: Record<string, "success" | "error" | "warning"> = {
          GRANTED: "success",
          REVOKED: "error",
          PENDING: "warning"
        };
        return (
          <Chip 
            label={params.value}
            color={statusColors[params.value]}
            size="small"
          />
        );
      },
    },
    {
      field: "consent_date",
      headerName: "Consent Date",
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">
            {new Date(params.value).toLocaleDateString()}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {new Date(params.value).toLocaleTimeString()}
          </Typography>
        </Box>
      ),
    },
    {
      field: "consent_collected",
      headerName: "Collected At",
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">
            {new Date(params.value).toLocaleDateString()}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {new Date(params.value).toLocaleTimeString()}
          </Typography>
        </Box>
      ),
    },
    {
      field: "geolocation",
      headerName: "Location",
      flex: 0.8,
      minWidth: 130,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value || '-'}
        </Typography>
      ),
    },
  ];

  // Handler functions
  const handleDensityClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDensityAnchorEl(event.currentTarget);
  };

  const handleDensityClose = () => {
    setDensityAnchorEl(null);
  };

  const handleDensityChange = (newDensity: GridDensity) => {
    setDensity(newDensity);
    handleDensityClose();
  };

  const handleConfigureClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleConfigureClose = () => {
    setAnchorEl(null);
  };

  const handleColumnToggle = (columnField: string) => {
    if (selectedColumns.includes(columnField)) {
      setSelectedColumns(selectedColumns.filter(column => column !== columnField));
    } else {
      setSelectedColumns([...selectedColumns, columnField]);
    }
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (field: string, value: string) => {
    setLocalFilters(prev => {
      const filterExists = prev.some(f => 
        typeof f === 'object' && 
        'field' in f && 
        f.field === field && 
        f.value === value
      );
      
      if (filterExists) {
        return prev.filter(f => 
          !(typeof f === 'object' && 
            'field' in f && 
            f.field === field && 
            f.value === value)
        );
      } else {
        const withoutField = prev.filter(f => 
          typeof f === 'object' && 
          'field' in f && 
          f.field !== field
        );
        return [...withoutField, {
          field: field,
          operator: "eq",
          value: value
        }];
      }
    });
  };

  return (
    <Box p={3}>
      <Box mb={3}>
        <Typography variant="h4" gutterBottom color="primary">
          Consent Records
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all consent records collected from various forms and applications. Track consent status, collection dates, and user identities.
        </Typography>
      </Box>

      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          sx={{ width: '75%' }}
          variant="outlined"
          placeholder="Search consents..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            search(e.target.value);
          }}
          size="small"
        />
        <Box display="flex" gap={1} alignItems="center" ml={2}>
          <IconButton 
            size="small" 
            onClick={handleFilterClick}
            title="Filters"
          >
            <FilterListIcon />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={handleDensityClick}
            title="Adjust density"
          >
            <ViewComfyIcon />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={handleConfigureClick}
            title="Configure columns"
          >
            <ViewColumnIcon />
          </IconButton>
        </Box>
      </Box>

      <Popover
        open={Boolean(densityAnchorEl)}
        anchorEl={densityAnchorEl}
        onClose={handleDensityClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box p={2}>
          <FormGroup>
            {['compact', 'comfortable'].map((d) => (
              <FormControlLabel
                key={d}
                control={
                  <Checkbox
                    checked={density === d}
                    onChange={() => handleDensityChange(d as GridDensity)}
                  />
                }
                label={d.charAt(0).toUpperCase() + d.slice(1)}
              />
            ))}
          </FormGroup>
        </Box>
      </Popover>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleConfigureClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box p={2}>
          <FormGroup>
            {columns.map((column) => (
              <FormControlLabel
                key={column.field}
                control={
                  <Checkbox
                    checked={selectedColumns.includes(column.field)}
                    onChange={() => handleColumnToggle(column.field)}
                    disabled={column.field === "subject_identity"}
                  />
                }
                label={column.headerName}
              />
            ))}
          </FormGroup>
        </Box>
      </Popover>

      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box p={2} minWidth={200}>
          <Typography variant="subtitle2" gutterBottom>
            Filters
          </Typography>
          <FormGroup>
            <Box mb={2}>
              <Typography variant="caption" color="textSecondary">
                Status
              </Typography>
              <Box display="flex" gap={1}>
                <Chip
                  label="Granted"
                  size="small"
                  onClick={() => handleFilterChange('consent_status', 'GRANTED')}
                  color={localFilters.some(f => 
                    typeof f === 'object' && 
                    'field' in f && 
                    f.field === 'consent_status' && 
                    f.value === 'GRANTED'
                  ) ? 'primary' : 'default'}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="Revoked"
                  size="small"
                  onClick={() => handleFilterChange('consent_status', 'REVOKED')}
                  color={localFilters.some(f => 
                    typeof f === 'object' && 
                    'field' in f && 
                    f.field === 'consent_status' && 
                    f.value === 'REVOKED'
                  ) ? 'primary' : 'default'}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="Pending"
                  size="small"
                  onClick={() => handleFilterChange('consent_status', 'PENDING')}
                  color={localFilters.some(f => 
                    typeof f === 'object' && 
                    'field' in f && 
                    f.field === 'consent_status' && 
                    f.value === 'PENDING'
                  ) ? 'primary' : 'default'}
                  sx={{ cursor: 'pointer' }}
                />
              </Box>
            </Box>
          </FormGroup>
        </Box>
      </Popover>

      <Card>
        <DataGrid
          {...dataGridProps}
          columns={columns.filter(column => selectedColumns.includes(column.field)).map(column => ({
            ...column,
            headerAlign: column.field === 'subject_identity' ? 'left' : 'center',
            align: column.field === 'subject_identity' ? 'left' : 'center',
            headerClassName: 'super-app-theme--header'
          }))}
          autoHeight
          pageSizeOptions={[10, 20, 50, 100]}
          density={density}
          slots={{
            toolbar: () => null,
          }}
          sx={{
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid",
              borderColor: "divider",
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "2px solid",
              borderColor: "divider",
            },
            "& .super-app-theme--header": {
              backgroundColor: (theme) => 
                theme.palette.mode === 'light' 
                  ? '#e3f2fd'
                  : 'primary.dark',
              color: (theme) => 
                theme.palette.mode === 'light'
                  ? '#1976d2'
                  : 'primary.contrastText',
              fontWeight: "600",
              '& .MuiDataGrid-columnHeaderTitle': {
                color: (theme) => 
                  theme.palette.mode === 'light'
                    ? '#1976d2'
                    : 'primary.contrastText',
              },
              '&:hover': {
                backgroundColor: (theme) => 
                  theme.palette.mode === 'light' 
                    ? '#bbdefb'
                    : 'primary.main',
              },
            },
          }}
          filterMode="server"
          disableColumnFilter={false}
        />
      </Card>
    </Box>
  );
}
