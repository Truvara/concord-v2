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
  Chip,
} from "@mui/material";
import { 
  ViewComfy as ViewComfyIcon, 
  ViewColumn as ViewColumnIcon,
  FilterList as FilterListIcon,
  Add as AddIcon
} from "@mui/icons-material";
import { CrudFilters, HttpError, useNavigation } from "@refinedev/core";
import { useRouter } from "next/navigation";

interface INotice {
  id: number;
  name: string;
  status: 'draft' | 'published';
  published_date: string;
  version: string;
  notice_links: any;
  managing_organization: any;
  co_owners: string[];
  approvers: string[];
}

export default function NoticeList() {
  const { show, create } = useNavigation();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [density, setDensity] = useState<GridDensity>('comfortable');
  const [densityAnchorEl, setDensityAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [localFilters, setLocalFilters] = useState<CrudFilters>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "name",
    "status",
    "published_date",
    "version",
    "co_owners",
    "approvers"
  ]);

  const { dataGridProps, search } = useDataGrid<INotice, HttpError>({
    resource: "notice",
    sorters: {
      initial: [{ field: "id", order: "desc" }],
    },
    filters: {
      mode: "server",
      defaultBehavior: "replace",
      permanent: localFilters,
    },
    pagination: {
      pageSize: 10,
    },
    onSearch: (value) => {
      const filters: CrudFilters = [];
      if (value) {
        filters.push({
          operator: "or",
          value: [
            { field: "name", operator: "contains", value },
            { field: "version", operator: "contains", value },
          ],
        });
      }
      return filters;
    },
  });

  const columns: GridColDef<INotice>[] = [
    {
      field: "name",
      headerName: "Notice Name",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box
          sx={{
            cursor: 'pointer',
            color: 'primary.main',
            '&:hover': { textDecoration: 'underline' }
          }}
          onClick={() => show("notice", params.row.id)}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={params.value === 'published' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: "published_date",
      headerName: "Published Date",
      flex: 1,
      minWidth: 180,
      valueFormatter: (params) => 
        params.value ? new Date(params.value).toLocaleDateString() : '-',
    },
    {
      field: "version",
      headerName: "Version",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "co_owners",
      headerName: "Co-owners",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          {params.value?.map((owner: string, index: number) => (
            <Chip 
              key={index} 
              label={owner} 
              size="small" 
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>
      ),
    },
    {
      field: "approvers",
      headerName: "Approvers",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          {params.value?.map((approver: string, index: number) => (
            <Chip 
              key={index} 
              label={approver} 
              size="small" 
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>
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
          Privacy Notices
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage privacy notices, versions, and publishing workflows.
        </Typography>
      </Box>

      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Box sx={{ width: '100%', display: 'flex', gap: 2 }}>
          <TextField
            sx={{ width: '100%' }}
            variant="outlined"
            placeholder="Search notices..."
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
          resource="notice"
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
                    disabled={column.field === "name"}
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
                  label="Published"
                  size="small"
                  onClick={() => handleFilterChange('status', 'published')}
                  color={localFilters.some(f => 
                    typeof f === 'object' && 
                    'field' in f && 
                    f.field === 'status' && 
                    f.value === 'published'
                  ) ? 'primary' : 'default'}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="Draft"
                  size="small"
                  onClick={() => handleFilterChange('status', 'draft')}
                  color={localFilters.some(f => 
                    typeof f === 'object' && 
                    'field' in f && 
                    f.field === 'status' && 
                    f.value === 'draft'
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
            headerAlign: column.field === 'name' ? 'left' : 'center',
            align: column.field === 'name' ? 'left' : 'center',
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
