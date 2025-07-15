"use client";

import React, { useState } from "react";
import { useDataGrid, List, CreateButton } from "@refinedev/mui";
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
  Link,
  Chip,
} from "@mui/material";
import { 
  ViewComfy as ViewComfyIcon, 
  ViewColumn as ViewColumnIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { CrudFilters, HttpError, useNavigation } from "@refinedev/core";
import { useRouter } from "next/navigation";

interface IPurpose {
  id: string;
  entity_id: string;
  purpose: string;
  purpose_duration: number;
  processing_purpose: string;
  is_mandatory: boolean;
  purpose_category: string | null;
  third_party_sharing: boolean | null;
  retention_period: number | null;
  expiration_date: string | null;
  entity_ids: string[];
}

export default function PurposeList() {
  const { show, create } = useNavigation();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [density, setDensity] = useState<GridDensity>('comfortable');
  const [densityAnchorEl, setDensityAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [localFilters, setLocalFilters] = useState<CrudFilters>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "purpose",
    "purpose_category",
    "purpose_duration",
    "is_mandatory",
    "retention_period",
    "expiration_date",
    "third_party_sharing",
    "entity_ids",
  ]);

  const { dataGridProps, search } = useDataGrid<IPurpose, HttpError>({
    resource: "purpose",
    sorters: {
      initial: [{ field: "purpose", order: "asc" }],
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
      const searchFilters: CrudFilters = [];
      if (value) {
        searchFilters.push({
          operator: "or",
          value: [
            { field: "purpose", operator: "contains", value },
            { field: "purpose_category", operator: "contains", value },
          ],
        });
      }
      return searchFilters;
    },
  });

  const handleConfigureClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleConfigureClose = () => {
    setAnchorEl(null);
  };

  const handleColumnToggle = (columnField: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnField)
        ? prev.filter((field) => field !== columnField)
        : [...prev, columnField]
    );
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

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

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (field: string, value: boolean) => {
    setLocalFilters(prev => {
      // Check if this exact filter already exists
      const filterExists = prev.some(f => 
        typeof f === 'object' && 
        'field' in f && 
        f.field === field && 
        f.value === value
      );
      
      if (filterExists) {
        // If filter exists, remove it
        return prev.filter(f => 
          !(typeof f === 'object' && 
            'field' in f && 
            f.field === field && 
            f.value === value)
        );
      } else {
        // If filter doesn't exist, remove any existing filter for this field and add the new one
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

  const columns: GridColDef<IPurpose>[] = [
    {
      field: "purpose",
      headerName: "Purpose",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <Box
          sx={{
            cursor: 'pointer',
            color: 'primary.main',
            '&:hover': { textDecoration: 'underline' },
            whiteSpace: 'normal',
            lineHeight: '1.2',
            padding: '8px 0',
            width: '100%'
          }}
          onClick={() => router.push(`/purpose/show/${params.row.id}`)}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "purpose_category",
      headerName: "Category",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ 
          whiteSpace: 'normal',
          lineHeight: '1.2',
          padding: '8px 0'
        }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "purpose_duration",
      headerName: "Duration",
      flex: 0.7,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value} months
        </Typography>
      ),
    },
    {
      field: "is_mandatory",
      headerName: "Mandatory",
      flex: 0.7,
      minWidth: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value ? "Yes" : "No"}
          color={params.value ? "primary" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "retention_period",
      headerName: "Retention",
      flex: 0.7,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? `${params.value} days` : '-'}
        </Typography>
      ),
    },
    {
      field: "expiration_date",
      headerName: "Expires",
      flex: 0.8,
      minWidth: 130,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? new Date(params.value).toLocaleDateString() : '-'}
        </Typography>
      ),
    },
    {
      field: "third_party_sharing",
      headerName: "3rd Party",
      flex: 0.7,
      minWidth: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value ? "Yes" : "No"}
          color={params.value ? "warning" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "entity_ids",
      headerName: "Entities",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const count = params.value?.length || 0;
        return (
          <Chip 
            label={`${count} ${count === 1 ? 'Entity' : 'Entities'}`}
            color="info"
            size="small"
          />
        );
      },
    },
  ];

  return (
    <Box p={3}>
      <Box mb={3}>
        <Typography variant="h4" gutterBottom color="primary">
          Purpose Registry
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and configure data processing purposes. Define duration, retention periods, and third-party sharing requirements.
        </Typography>
      </Box>

      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Box sx={{ width: '100%', display: 'flex', gap: 2 }}>
          <TextField
            sx={{ width: '100%' }}
            variant="outlined"
            placeholder="Search purposes..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              search(e.target.value);
            }}
            size="small"
          />
          <Box display="flex" gap={1} alignItems="center">
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
        <CreateButton
          resource="purpose"
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
        />
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
                    disabled={column.field === "purpose"}
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
                Mandatory
              </Typography>
              <Box display="flex" gap={1}>
                <Chip
                  label="Yes"
                  size="small"
                  onClick={() => handleFilterChange('is_mandatory', true)}
                  color={localFilters.some(f => 
                    typeof f === 'object' && 
                    'field' in f && 
                    f.field === 'is_mandatory' && 
                    f.value === true
                  ) ? 'primary' : 'default'}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="No"
                  size="small"
                  onClick={() => handleFilterChange('is_mandatory', false)}
                  color={localFilters.some(f => 
                    typeof f === 'object' && 
                    'field' in f && 
                    f.field === 'is_mandatory' && 
                    f.value === false
                  ) ? 'primary' : 'default'}
                  sx={{ cursor: 'pointer' }}
                />
              </Box>
            </Box>
            
            <Box>
              <Typography variant="caption" color="textSecondary">
                3rd Party Sharing
              </Typography>
              <Box display="flex" gap={1}>
                <Chip
                  label="Yes"
                  size="small"
                  onClick={() => handleFilterChange('third_party_sharing', true)}
                  color={localFilters.some(f => 
                    typeof f === 'object' && 
                    'field' in f && 
                    f.field === 'third_party_sharing' && 
                    f.value === true
                  ) ? 'primary' : 'default'}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="No"
                  size="small"
                  onClick={() => handleFilterChange('third_party_sharing', false)}
                  color={localFilters.some(f => 
                    typeof f === 'object' && 
                    'field' in f && 
                    f.field === 'third_party_sharing' && 
                    f.value === false
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
            headerAlign: column.field === 'purpose' || column.field === 'purpose_category' ? 'left' : 'center',
            align: column.field === 'purpose' || column.field === 'purpose_category' ? 'left' : 'center',
            headerClassName: 'super-app-theme--header'
          }))}
          autoHeight
          getRowHeight={() => 72}
          pageSizeOptions={[10, 20, 50, 100]}
          density={density}
          slots={{
            toolbar: () => null,
          }}
          sx={{
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid",
              borderColor: "divider",
              maxHeight: "none !important",
              overflow: "visible !important",
              whiteSpace: "normal",
              lineHeight: "1.2",
              padding: "16px 14px",
              display: "flex",
              alignItems: "center",
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
