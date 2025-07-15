"use client";

import React, { useState } from "react";
import {
  useDataGrid,
  List,
  CreateButton,
} from "@refinedev/mui";
import { 
  DataGrid, 
  GridColDef,
  GridDensity
} from "@mui/x-data-grid";
import { 
  Box,
  Card,
  Chip,
  TextField,
  IconButton,
  Popover,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Button
} from "@mui/material";
import { 
  ViewComfy as ViewComfyIcon, 
  ViewColumn as ViewColumnIcon,
  FilterList as FilterListIcon,
  Add as AddIcon
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { CrudFilters, useNavigation } from "@refinedev/core";
import { useRouter } from "next/navigation";

interface IPreference {
  id: number;
  app_identifier: string;
  form_identifier: string;
  preference_center_version: string;
  app_version: string;
  last_updated: string;
}

export default function PreferencesList() {
  const theme = useTheme();
  const { show, create } = useNavigation();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [density, setDensity] = useState<GridDensity>('comfortable');
  const [densityAnchorEl, setDensityAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [localFilters, setLocalFilters] = useState<CrudFilters>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "app_identifier",
    "form_identifier",
    "preference_center_version",
    "app_version",
    "last_updated"
  ]);

  const { dataGridProps, search } = useDataGrid<IPreference>({
    resource: "preferences",
    initialPageSize: 10,
    pagination: {
      pageSize: 10,
    },
    filters: {
      mode: "server",
      defaultBehavior: "replace",
      initial: [
        {
          field: "app_version",
          operator: "not.is",
          value: null
        }
      ],
      permanent: localFilters,
    },
    sorters: {
      initial: [
        {
          field: "last_updated",
          order: "desc",
        },
      ],
    },
    meta: {
      select: "*",
    }
  });

  const columns: GridColDef<IPreference>[] = [
    {
      field: "app_identifier",
      headerName: "App Identifier",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box
          sx={{
            cursor: 'pointer',
            color: theme.palette.primary.main,
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
          onClick={() => show("preferences", params.row.id)}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "form_identifier",
      headerName: "Form Identifier",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "preference_center_version",
      headerName: "Version",
      width: 120,
      renderCell: (params) => (
        params.value ? (
          <Chip 
            label={params.value}
            color="primary"
            size="small"
          />
        ) : "-"
      ),
    },
    {
      field: "app_version",
      headerName: "App Version",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "last_updated",
      headerName: "Last Updated",
      flex: 1,
      minWidth: 160,
      renderCell: (params) => {
        if (!params.value) return "-";
        const date = new Date(params.value);
        return (
          <Box>
            <div>{date.toLocaleDateString()}</div>
            <div style={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>
              {date.toLocaleTimeString()}
            </div>
          </Box>
        );
      },
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

  const handleFilterChange = (field: string, value: string | null) => {
    setLocalFilters((prev) => {
      const existingFilterIndex = prev.findIndex(
        (f) => typeof f === 'object' && 'field' in f && f.field === field
      );

      if (existingFilterIndex > -1) {
        if (!value) {
          return prev.filter((_, index) => index !== existingFilterIndex);
        }
        const newFilters = [...prev];
        newFilters[existingFilterIndex] = {
          field,
          operator: 'eq',
          value,
        };
        return newFilters;
      }

      if (!value) return prev;

      return [
        ...prev,
        {
          field,
          operator: 'eq',
          value,
        },
      ];
    });
  };

  return (
    <Box p={3}>
      <Box mb={3}>
        <Typography variant="h4" gutterBottom color="primary">
          Form Preferences
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage form preferences and settings across different applications and versions.
        </Typography>
      </Box>

      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Box sx={{ width: '100%', display: 'flex', gap: 2 }}>
          <TextField
            sx={{ width: '100%' }}
            variant="outlined"
            placeholder="Search preferences..."
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
          resource="preferences"
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
        />
      </Box>

      {/* Density Popover */}
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

      {/* Column Selection Popover */}
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
                    disabled={column.field === "app_identifier"}
                  />
                }
                label={column.headerName}
              />
            ))}
          </FormGroup>
        </Box>
      </Popover>

      {/* Filter Popover */}
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
                App Version
              </Typography>
              <Box display="flex" gap={1}>
                <Chip
                  label="v1"
                  size="small"
                  onClick={() => handleFilterChange('app_version', 'v1')}
                  color={localFilters.some(f => 
                    typeof f === 'object' && 
                    'field' in f && 
                    f.field === 'app_version' && 
                    f.value === 'v1'
                  ) ? 'primary' : 'default'}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="v2"
                  size="small"
                  onClick={() => handleFilterChange('app_version', 'v2')}
                  color={localFilters.some(f => 
                    typeof f === 'object' && 
                    'field' in f && 
                    f.field === 'app_version' && 
                    f.value === 'v2'
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
            headerAlign: column.field === 'app_identifier' ? 'left' : 'center',
            align: column.field === 'app_identifier' ? 'left' : 'center',
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
