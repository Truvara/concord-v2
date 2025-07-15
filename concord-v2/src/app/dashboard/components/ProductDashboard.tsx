"use client";

import { Box, Grid, Paper, Typography } from "@mui/material";
import { Chart as ChartJS, ChartOptions } from 'chart.js/auto';
import { useProductDashboardData } from "../hooks/useProductDashboardData";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef } from "react";

// Theme colors definition
const THEME_COLORS = {
  LIGHT: {
    GRANTED: "#81C784",
    PENDING: "#FFD54F",
    REVOKED: "#FF8A65",
    EXPIRED: "#90A4AE",
    PRIMARY: "#90CAF9",
    SECONDARY: "#CE93D8",
    BACKGROUND: "#F5F5F5",
    PAPER: "#FFFFFF",
    TEXT: "#424242",
    CHART_COLORS: [
      "#90CAF9",
      "#81C784",
      "#CE93D8",
      "#FFD54F",
      "#FF8A65",
      "#80DEEA",
    ]
  },
  DARK: {
    GRANTED: "#00C853",
    PENDING: "#FFD600",
    REVOKED: "#FF3D00",
    EXPIRED: "#78909C",
    PRIMARY: "#90CAF9",
    SECONDARY: "#CE93D8",
    BACKGROUND: "#424242",
    PAPER: "#303030",
    TEXT: "#FFFFFF",
    CHART_COLORS: [
      "#90CAF9",
      "#00C853",
      "#CE93D8",
      "#FFD600",
      "#FF3D00",
      "#00BCD4",
    ]
  }
} as const;

interface ProductDashboardProps {
  filters: {
    dateRange: [Date, Date];
    platform: string;
    purpose: string;
    appVersion: string;
  };
}

// Update font style to be theme-aware
const CHART_FONT_STYLE = (theme: any) => ({
  family: '"SF Pro Display", "Inter", sans-serif',
  size: 12,
  weight: 500,
  color: theme.palette.text.primary
}) as const;

const CHART_TITLE_STYLE = {
  fontFamily: '"SF Pro Display", "Inter", sans-serif',
  fontSize: '1.125rem',
  fontWeight: 600,
  color: 'inherit',
  marginBottom: '1rem',
};

const DONUT_LABEL_STYLE = {
  fontFamily: '"Inter", "Roboto", sans-serif',
  fontSize: '5px',
  fontWeight: 500,
};

// Add these custom styles for animations
const BAR_ANIMATION = `
  @keyframes growFromBottom {
    from {
      transform: scaleY(0);
      transform-origin: bottom;
    }
    to {
      transform: scaleY(1);
      transform-origin: bottom;
    }
  }
`;

export default function ProductDashboard({ filters }: ProductDashboardProps) {
  const theme = useTheme();
  const colors = theme.palette.mode === 'dark' ? THEME_COLORS.DARK : THEME_COLORS.LIGHT;
  
  const pieChartRef = useRef<HTMLCanvasElement>(null);
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const permissionChartRef = useRef<HTMLCanvasElement>(null);
  const trendChartRef = useRef<HTMLCanvasElement>(null);

  const {
    consentStatusData,
    formsEntityData,
    formsPermissionsData,
    consentTrendsData,
    isLoading,
  } = useProductDashboardData(filters);

  useEffect(() => {
    if (isLoading) return;

    // Cleanup any existing charts first
    const cleanup = () => {
      const charts = [
        pieChartRef, 
        barChartRef, 
        permissionChartRef, 
        trendChartRef
      ].map(ref => {
        if (ref.current) {
          return ChartJS.getChart(ref.current as HTMLCanvasElement);
        }
        return null;
      });
      
      charts.forEach(chart => chart?.destroy());
    };

    // Clean up existing charts before creating new ones
    cleanup();

    // Consent Status Pie Chart
    if (pieChartRef.current) {
      const ctx = pieChartRef.current.getContext('2d');
      if (ctx) {
        new ChartJS(ctx, {
          type: 'doughnut',
          data: {
            labels: consentStatusData.map(d => d.name),
            datasets: [{
              data: consentStatusData.map(d => d.value),
              backgroundColor: consentStatusData.map(d => d.color),
              borderWidth: 0,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '55%', // Reduced from default
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: theme.palette.text.primary,
                  font: CHART_FONT_STYLE(theme)
                }
              }
            }
          } as ChartOptions
        });
      }
    }

    // Forms by Entity Bar Chart
    if (barChartRef.current) {
      const ctx = barChartRef.current.getContext('2d');
      if (ctx) {
        new ChartJS(ctx, {
          type: 'bar',
          data: {
            labels: formsEntityData.map(d => d.entityName),
            datasets: [{
              label: 'Form Count',
              data: formsEntityData.map(d => d.formCount),
              backgroundColor: colors.PRIMARY,
              borderRadius: 4,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: theme.palette.divider
                },
                ticks: {
                  color: theme.palette.text.primary,
                  font: CHART_FONT_STYLE(theme)
                }
              },
              x: {
                grid: {
                  color: theme.palette.divider
                },
                ticks: {
                  maxRotation: 45,
                  minRotation: 45,
                  color: theme.palette.text.primary,
                  font: CHART_FONT_STYLE(theme)
                }
              }
            }
          } as ChartOptions
        });
      }
    }

    // Permission Distribution Chart
    if (permissionChartRef.current) {
      const ctx = permissionChartRef.current.getContext('2d');
      if (ctx) {
        new ChartJS(ctx, {
          type: 'bar',
          data: {
            labels: formsPermissionsData.map(d => d.formName),
            datasets: [{
              label: 'Permission Count',
              data: formsPermissionsData.map(d => d.permissionCount),
              backgroundColor: colors.SECONDARY,
              borderRadius: 4,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: theme.palette.divider
                },
                ticks: {
                  color: theme.palette.text.primary,
                  font: CHART_FONT_STYLE(theme)
                }
              },
              x: {
                grid: {
                  color: theme.palette.divider
                },
                ticks: {
                  maxRotation: 45,
                  minRotation: 45,
                  color: theme.palette.text.primary,
                  font: CHART_FONT_STYLE(theme)
                }
              }
            }
          } as ChartOptions
        });
      }
    }

    // Consent Trends Line Chart
    if (trendChartRef.current) {
      const ctx = trendChartRef.current.getContext('2d');
      if (ctx) {
        new ChartJS(ctx, {
          type: 'line',
          data: {
            labels: consentTrendsData.map(d => d.date),
            datasets: [
              {
                label: 'GRANTED',
                data: consentTrendsData.map(d => d.GRANTED),
                borderColor: colors.GRANTED,
                backgroundColor: colors.GRANTED + '20',
                tension: 0.4,
              },
              {
                label: 'PENDING',
                data: consentTrendsData.map(d => d.PENDING),
                borderColor: colors.PENDING,
                backgroundColor: colors.PENDING + '20',
                tension: 0.4,
              },
              {
                label: 'REVOKED',
                data: consentTrendsData.map(d => d.REVOKED),
                borderColor: colors.REVOKED,
                backgroundColor: colors.REVOKED + '20',
                tension: 0.4,
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: theme.palette.text.primary,
                  font: CHART_FONT_STYLE(theme)
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: theme.palette.divider
                },
                ticks: {
                  color: theme.palette.text.primary,
                  font: CHART_FONT_STYLE(theme)
                }
              },
              x: {
                grid: {
                  color: theme.palette.divider
                },
                ticks: {
                  maxRotation: 45,
                  minRotation: 45,
                  color: theme.palette.text.primary,
                  font: CHART_FONT_STYLE(theme)
                }
              }
            }
          } as ChartOptions
        });
      }
    }

    // Cleanup on unmount or when dependencies change
    return cleanup;
  }, [consentStatusData, formsEntityData, formsPermissionsData, consentTrendsData, colors, theme, isLoading]);

  if (isLoading) return null;

  return (
    <Grid container spacing={3}>
      {/* Main Charts Row */}
      <Grid item xs={12} container spacing={3}>
        {/* Consent Status Breakdown */}
        <Grid item xs={12} md={5}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, height: '550px' }}>
              <Typography sx={CHART_TITLE_STYLE}>
                Consent Status Breakdown
              </Typography>
              <Box sx={{ height: 400, position: 'relative' }}>
                <canvas ref={pieChartRef} />
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Forms by Entity */}
        <Grid item xs={12} md={7}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, height: '550px' }}>
              <Typography sx={CHART_TITLE_STYLE}>
                Forms by Entity Distribution
              </Typography>
              <Box sx={{ height: 450, position: 'relative' }}>
                <canvas ref={barChartRef} />
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Forms Permission Distribution */}
      <Grid item xs={12}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, height: '682px' }}>
            <Typography sx={CHART_TITLE_STYLE}>
              Forms Permission Distribution
            </Typography>
            <Box sx={{ height: 500, position: 'relative' }}>
              <canvas ref={permissionChartRef} />
            </Box>
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block',
                textAlign: 'center',
                mt: 2,
                color: 'text.secondary'
              }}
            >
              Overview of permission counts across different forms, showing the distribution of access rights and consent requirements.
            </Typography>
          </Paper>
        </motion.div>
      </Grid>

      {/* Consent Trends */}
      <Grid item xs={12}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, height: '550px' }}>
            <Typography sx={CHART_TITLE_STYLE}>
              Consent Trends
            </Typography>
            <Box sx={{ height: 400, position: 'relative' }}>
              <canvas ref={trendChartRef} />
            </Box>
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block',
                textAlign: 'center',
                mt: 2,
                color: 'text.secondary'
              }}
            >
              Historical view of consent status changes over time, tracking granted, pending, and revoked consents.
            </Typography>
          </Paper>
        </motion.div>
      </Grid>
    </Grid>
  );
}

// Add TypeScript interfaces for the data
interface ConsentStatusItem {
  name: string;
  value: number;
  color: string;
}

interface FormsEntityItem {
  entityName: string;
  formCount: number;
}

interface FormsPermissionsItem {
  formName: string;
  permissionCount: number;
}

interface ConsentTrendsItem {
  date: string;
  GRANTED: number;
  PENDING: number;
  REVOKED: number;
}
