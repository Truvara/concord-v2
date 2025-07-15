"use client";

import { useState } from "react";
import { Box, Tabs, Tab, Grid, Paper } from "@mui/material";
import ProductDashboard from "./components/ProductDashboard";
import PrivacyDashboard from "./components/PrivacyDashboard";
import DashboardFilters from "./components/DashboardFilters";
import MetricCards from "./components/MetricCards";
import { styled } from '@mui/material/styles';
import { useDashboardData } from "./hooks/useDashboardData";

// Custom styled Tab
const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '1rem',
  fontFamily: '"SF Pro Display", "Inter", sans-serif',
  fontWeight: 500,
  minHeight: '48px',
  padding: '6px 16px',
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: 600
  }
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function DashboardPage() {
  const [tabValue, setTabValue] = useState(0);
  const [filters, setFilters] = useState<{
    dateRange: [Date, Date];
    platform: string;
    appVersion: string;
  }>({
    dateRange: [
      new Date(new Date().setMonth(new Date().getMonth() - 1)),
      new Date()
    ],
    platform: "",
    appVersion: ""
  });

  const { aggregateData, isLoading } = useDashboardData(filters);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      {/* Common Filters */}
      <DashboardFilters filters={filters} onFilterChange={setFilters} />

      {/* Common Metric Cards */}
      <Box sx={{ my: 3 }}>
        <MetricCards data={aggregateData} isLoading={isLoading} />
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="dashboard tabs"
          sx={{
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0'
            },
          }}
        >
          <StyledTab label="Product" />
          <StyledTab label="Privacy" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <ProductDashboard 
          filters={{
            ...filters,
            purpose: ""
          }} 
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <PrivacyDashboard filters={filters} />
      </TabPanel>
    </Box>
  );
}