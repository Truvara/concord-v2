import {
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import { styled } from '@mui/material/styles';

interface FilterProps {
  filters: {
    dateRange: [Date, Date];
    platform: string;
    appVersion: string;
  };
  onFilterChange: (filters: any) => void;
}

const StyledInputLabel = styled(InputLabel)({
  fontFamily: '"SF Pro Display", "Inter", sans-serif',
  fontSize: '0.875rem',
});

const StyledSelect = styled(Select)({
  fontFamily: '"SF Pro Display", "Inter", sans-serif',
  fontSize: '0.875rem',
});

const StyledMenuItem = styled(MenuItem)({
  fontFamily: '"SF Pro Display", "Inter", sans-serif',
  fontSize: '0.875rem',
});

export default function DashboardFilters({ filters, onFilterChange }: FilterProps) {
  const handleDateChange = (type: 'start' | 'end') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value ? new Date(event.target.value) : new Date();
    const newDateRange: [Date, Date] = [...filters.dateRange] as [Date, Date];
    
    if (type === 'start') {
      newDateRange[0] = newDate;
      // Ensure end date is not before start date
      if (newDateRange[1] < newDate) {
        newDateRange[1] = newDate;
      }
    } else {
      newDateRange[1] = newDate;
      // Ensure start date is not after end date
      if (newDateRange[0] > newDate) {
        newDateRange[0] = newDate;
      }
    }

    onFilterChange({
      ...filters,
      dateRange: newDateRange,
    });
  };

  const handleFilterChange = (field: string) => (event: any) => {
    onFilterChange({
      ...filters,
      [field]: event.target.value,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 2 }}>
        <Grid container spacing={2}>
          {/* Start Date */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              value={filters.dateRange[0].toISOString().split('T')[0]}
              onChange={handleDateChange('start')}
              InputLabelProps={{ 
                shrink: true,
                sx: { fontFamily: '"SF Pro Display", "Inter", sans-serif' }
              }}
              inputProps={{
                style: { fontFamily: '"SF Pro Display", "Inter", sans-serif' },
                max: filters.dateRange[1].toISOString().split('T')[0] // Prevent selecting start date after end date
              }}
              size="small"
            />
          </Grid>

          {/* End Date */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              type="date"
              label="End Date"
              value={filters.dateRange[1].toISOString().split('T')[0]}
              onChange={handleDateChange('end')}
              InputLabelProps={{ 
                shrink: true,
                sx: { fontFamily: '"SF Pro Display", "Inter", sans-serif' }
              }}
              inputProps={{
                style: { fontFamily: '"SF Pro Display", "Inter", sans-serif' },
                min: filters.dateRange[0].toISOString().split('T')[0] // Prevent selecting end date before start date
              }}
              size="small"
            />
          </Grid>

          {/* Platform Dropdown */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <StyledInputLabel>Platform</StyledInputLabel>
              <StyledSelect
                value={filters.platform}
                label="Platform"
                onChange={handleFilterChange('platform')}
              >
                <StyledMenuItem value="">All</StyledMenuItem>
                <StyledMenuItem value="web">Web</StyledMenuItem>
                <StyledMenuItem value="mobile">Mobile</StyledMenuItem>
              </StyledSelect>
            </FormControl>
          </Grid>

          {/* App Version Dropdown */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <StyledInputLabel>App Version</StyledInputLabel>
              <StyledSelect
                value={filters.appVersion}
                label="App Version"
                onChange={handleFilterChange('appVersion')}
              >
                <StyledMenuItem value="">All</StyledMenuItem>
                <StyledMenuItem value="1.0.0">1.0.0</StyledMenuItem>
                <StyledMenuItem value="1.1.0">1.1.0</StyledMenuItem>
              </StyledSelect>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
    </motion.div>
  );
} 