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
  GridToolbar,
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
import { CrudFilters, useNavigation, BaseRecord } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { useMany } from "@refinedev/core";

interface Purpose extends BaseRecord {
  id: string;
  purpose: string;
  entity_ids?: string[];
}

export default function FormsList() {
  const theme = useTheme();
  const { show, create } = useNavigation();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [density, setDensity] = useState<GridDensity>('comfortable');
  const [densityAnchorEl, setDensityAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "form_name",
    "endpoint",
    "form_type",
    "subject_identifier_type",
    "purpose",
    "entity",
    "permissions",
    "form_owner_primary",
    "created_at"
  ]);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [localFilters, setLocalFilters] = useState<CrudFilters>([]);

  const { dataGridProps, search } = useDataGrid({
    resource: "forms",
    initialPageSize: 10,
    pagination: {
      pageSize: 10,
    },
    filters: {
      mode: "server",
      defaultBehavior: "replace",
      permanent: localFilters,
    },
    sorters: {
      initial: [
        {
          field: "created_at",
          order: "desc",
        },
      ],
    },
    meta: {
      select: "*",
    },
  });

  const { data: purposesData } = useMany({
    resource: "purpose",
    ids: dataGridProps?.rows?.flatMap(row => row.purpose_ids || []) || [],
    queryOptions: {
      enabled: !!dataGridProps?.rows?.length,
    },
  });

  const columns: GridColDef[] = [
    {
      field: "form_name",
      headerName: "Form Name",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <Box
          sx={{
            cursor: 'pointer',
            color: theme.palette.primary.main,
            '&:hover': {
              textDecoration: 'underline',
            },
            whiteSpace: 'normal',
            lineHeight: '1.2',
            padding: '8px 0',
          }}
          onClick={() => show("forms", params.row.id)}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "endpoint",
      headerName: "Endpoint",
      flex: 1,
      minWidth: 250,
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
      field: "form_type",
      headerName: "Type",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "web" ? "primary" : "secondary"}
          size="small"
        />
      ),
    },
    {
      field: "subject_identifier_type",
      headerName: "Identifier Type",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "purpose_ids",
      headerName: "Purposes",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        const purposeIds = params.row.purpose_ids || [];
        const purposes = purposeIds.map((id: string) => 
          purposesData?.data?.find((p: BaseRecord) => p.id === id)
        ).filter((p: unknown): p is Purpose => p !== undefined);
        return purposes.map((p: Purpose) => p.purpose).join(", ") || "-";
      },
      renderCell: (params) => {
        const purposeIds = params.row.purpose_ids || [];
        return purposeIds.length > 0 ? (
          <Chip
            label={`${purposeIds.length} purpose${purposeIds.length > 1 ? 's' : ''}`}
            color="info"
            size="small"
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No purposes
          </Typography>
        );
      },
    },
    {
      field: "entity",
      headerName: "Entities",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        const purposeIds = params.row.purpose_ids || [];
        const purposes = purposeIds
          .map((id: string) => purposesData?.data?.find((p: BaseRecord) => p.id === id))
          .filter(Boolean);
        
        // Get unique entity IDs from all purposes
        const uniqueEntityIds = Array.from(new Set(purposes.flatMap((p: BaseRecord) => p?.entity_ids || [])));
        return uniqueEntityIds.length > 0 ? `${uniqueEntityIds.length} entities` : "-";
      },
      renderCell: (params) => {
        const purposeIds = params.row.purpose_ids || [];
        const purposes = purposeIds
          .map((id: string) => purposesData?.data?.find((p: BaseRecord) => p.id === id))
          .filter(Boolean);
        
        const uniqueEntityIds = Array.from(new Set(purposes.flatMap((p: BaseRecord) => p?.entity_ids || [])));
        
        return uniqueEntityIds.length > 0 ? (
          <Chip
            label={`${uniqueEntityIds.length} ${uniqueEntityIds.length === 1 ? 'entity' : 'entities'}`}
            color="info"
            size="small"
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No entities
          </Typography>
        );
      },
    },
    {
      field: "permissions",
      headerName: "Permissions",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        try {
          return typeof params.row.permissions === 'string' 
            ? JSON.parse(params.row.permissions)
            : (Array.isArray(params.row.permissions) ? params.row.permissions : []);
        } catch (e) {
          return [];
        }
      },
      renderCell: (params) => {
        const permissions = params.value || [];
        return (
          <Box>
            {permissions.length > 0 ? (
              <Chip
                label={`${permissions.length} permission${permissions.length > 1 ? 's' : ''}`}
                color="info"
                size="small"
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No permissions
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: "form_owner_primary",
      headerName: "Primary Owner",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "created_at",
      headerName: "Created At",
      flex: 1,
      minWidth: 160,
      renderCell: (params) => {
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
          Forms
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage data collection forms, endpoints, and form configurations.
        </Typography>
      </Box>

      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Box sx={{ width: '100%', display: 'flex', gap: 2 }}>
          <TextField
            sx={{ width: '100%' }}
            variant="outlined"
            placeholder="Search forms..."
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
          resource="forms"
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
        />
      </Box>

      {/* Add Density Popover */}
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

      {/* Add Column Selection Popover */}
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
                    disabled={column.field === "form_name"}
                  />
                }
                label={column.headerName}
              />
            ))}
          </FormGroup>
        </Box>
      </Popover>

      {/* Add Filter Popover */}
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
                Form Type
              </Typography>
              <Box display="flex" gap={1}>
                <Chip
                  label="Web"
                  size="small"
                  onClick={() => handleFilterChange('form_type', 'web')}
                  color={localFilters.some(f =>
                    typeof f === 'object' &&
                    'field' in f &&
                    f.field === 'form_type' &&
                    f.value === 'web'
                  ) ? 'primary' : 'default'}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="API"
                  size="small"
                  onClick={() => handleFilterChange('form_type', 'api')}
                  color={localFilters.some(f =>
                    typeof f === 'object' &&
                    'field' in f &&
                    f.field === 'form_type' &&
                    f.value === 'api'
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
            headerAlign: column.field === 'form_name' ? 'left' : 'center',
            align: column.field === 'form_name' ? 'left' : 'center',
            headerClassName: 'super-app-theme--header'
          }))}
          autoHeight
          getRowHeight={() => 72}
          pageSizeOptions={[10, 20, 50, 100]}
          density={density}
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
