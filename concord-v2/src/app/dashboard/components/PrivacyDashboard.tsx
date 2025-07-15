"use client";

import { Grid, Paper, Typography, Box } from "@mui/material";
import { Chart as ChartJS, ChartOptions } from 'chart.js/auto';
import { usePrivacyDashboardData } from "../hooks/usePrivacyDashboardData";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";
import { useEffect, useRef } from "react";

// Theme colors definition - matching ProductDashboard
const THEME_COLORS = {
  LIGHT: {
    GRANTED: "#81C784",
    PENDING: "#FFD54F",
    REVOKED: "#FF8A65",
    EXPIRED: "#90A4AE",
    PRIMARY: "#90CAF9",
    SECONDARY: "#CE93D8",
    MANDATORY: "#00C853",
    OPTIONAL: "#FF9800",
    BACKGROUND: "#F5F5F5",
    PAPER: "#FFFFFF",
    TEXT: "#424242",
  },
  DARK: {
    GRANTED: "#00C853",
    PENDING: "#FFD600",
    REVOKED: "#FF3D00",
    EXPIRED: "#78909C",
    PRIMARY: "#90CAF9",
    SECONDARY: "#CE93D8",
    MANDATORY: "#00C853",
    OPTIONAL: "#FF9800",
    BACKGROUND: "#424242",
    PAPER: "#303030",
    TEXT: "#FFFFFF",
  }
} as const;

interface PrivacyDashboardProps {
  filters: {
    dateRange: [Date, Date];
    platform: string;
    appVersion: string;
  };
}

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

const CHART_DESCRIPTION_STYLE = {
  display: 'block',
  textAlign: 'center',
  mt: 2,
  color: 'text.secondary',
  fontFamily: '"SF Pro Display", "Inter", sans-serif',
  fontSize: '0.75rem',
  opacity: 0.8
};

type ExtendedChartOptions = ChartOptions & {
  cutout?: string | number;
  scales?: {
    y?: {
      beginAtZero: boolean;
      grid: {
        color: string;
      };
      ticks: {
        color: string;
        font: {
          family: string;
          size: number;
          weight: number;
        };
      };
    };
    x?: {
      grid: {
        color: string;
      };
      ticks: {
        maxRotation: number;
        minRotation: number;
        color: string;
        font: {
          family: string;
          size: number;
          weight: number;
        };
      };
    };
  };
};

export default function PrivacyDashboard({ filters }: PrivacyDashboardProps) {
  const theme = useTheme();
  const colors = theme.palette.mode === 'dark' ? THEME_COLORS.DARK : THEME_COLORS.LIGHT;

  const pieChartRef = useRef<HTMLCanvasElement>(null);
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const lineChartRef = useRef<HTMLCanvasElement>(null);

  const {
    mandatoryVsOptionalData,
    expiredConsentsData,
    geolocationData,
    noticeStatusData,
    isLoading
  } = usePrivacyDashboardData(filters);

  useEffect(() => {
    if (isLoading) return;

    const fontStyle = CHART_FONT_STYLE(theme);

    // Cleanup any existing charts first
    const cleanup = () => {
      const charts = [pieChartRef, barChartRef, lineChartRef].map(ref => {
        if (ref.current) {
          return ChartJS.getChart(ref.current as HTMLCanvasElement);
        }
        return null;
      });
      
      charts.forEach(chart => chart?.destroy());
    };

    // Clean up existing charts before creating new ones
    cleanup();

    // Mandatory vs Optional Pie Chart
    if (pieChartRef.current) {
      const ctx = pieChartRef.current.getContext('2d');
      if (ctx) {
        new ChartJS(ctx, {
          type: 'doughnut',
          data: {
            labels: mandatoryVsOptionalData.map(d => d.name),
            datasets: [{
              data: mandatoryVsOptionalData.map(d => d.value),
              backgroundColor: mandatoryVsOptionalData.map(d => d.color),
              borderWidth: 0,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '55%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: theme.palette.text.primary,
                  font: fontStyle
                }
              }
            }
          } as ExtendedChartOptions
        });
      }
    }

    // Notice Status Bar Chart
    if (barChartRef.current) {
      const ctx = barChartRef.current.getContext('2d');
      if (ctx) {
        new ChartJS(ctx, {
          type: 'bar',
          data: {
            labels: noticeStatusData.map(d => d.status),
            datasets: [{
              label: 'Count',
              data: noticeStatusData.map(d => d.count),
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
                  font: fontStyle
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
                  font: fontStyle
                }
              }
            }
          } as ExtendedChartOptions
        });
      }
    }

    // Expired Consents Line Chart
    if (lineChartRef.current) {
      const ctx = lineChartRef.current.getContext('2d');
      if (ctx) {
        new ChartJS(ctx, {
          type: 'line',
          data: {
            labels: expiredConsentsData.map(d => d.date),
            datasets: [{
              label: 'Expired Consents',
              data: expiredConsentsData.map(d => d.count),
              borderColor: theme.palette.warning.main,
              backgroundColor: theme.palette.warning.main + '20',
              tension: 0.4,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: theme.palette.text.primary,
                  font: fontStyle
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
                  font: fontStyle
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
                  font: fontStyle
                }
              }
            }
          } as ExtendedChartOptions
        });
      }
    }

    // Cleanup on unmount or when dependencies change
    return cleanup;
  }, [mandatoryVsOptionalData, expiredConsentsData, noticeStatusData, colors, theme, isLoading]);

  if (isLoading) return null;

  // Transform geolocation data for jVectorMap
  const mapData: Record<string, number> = geolocationData.reduce((acc, item) => ({
    ...acc,
    [item.location]: item.count
  }), {});

  return (
    <Grid container spacing={3}>
      {/* Main Charts Row */}
      <Grid item xs={12} container spacing={3}>
        {/* Mandatory vs Optional Consents */}
        <Grid item xs={12} md={5}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, height: '550px' }}>
              <Typography sx={CHART_TITLE_STYLE}>
                Mandatory vs Optional Consents
              </Typography>
              <Box sx={{ height: 400, position: 'relative' }}>
                <canvas ref={pieChartRef} />
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Notice Status Distribution */}
        <Grid item xs={12} md={7}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, height: '550px' }}>
              <Typography sx={CHART_TITLE_STYLE}>
                Notice Status Distribution
              </Typography>
              <Box sx={{ height: 450, position: 'relative' }}>
                <canvas ref={barChartRef} />
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Expired Consents Timeline */}
      <Grid item xs={12}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, height: '550px' }}>
            <Typography sx={CHART_TITLE_STYLE}>
              Expired Consents Timeline
            </Typography>
            <Box sx={{ height: 400, position: 'relative' }}>
              <canvas ref={lineChartRef} />
            </Box>
            <Typography variant="caption" sx={CHART_DESCRIPTION_STYLE}>
              Track trends of expiring consents over time for compliance monitoring.
            </Typography>
          </Paper>
        </motion.div>
      </Grid>

      {/* World Map for Geolocation */}
      <Grid item xs={12}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, height: '600px' }}>
            <Typography sx={CHART_TITLE_STYLE}>
              Geolocation Distribution
            </Typography>
            <Box sx={{ height: 500 }}>
              <VectorMap
                map={worldMill}
                backgroundColor="transparent"
                style={{
                  width: "100%",
                  height: "100%"
                }}
                series={{
                  regions: [{
                    attribute: 'fill',
                    values: mapData,
                    scale: [theme.palette.primary.light, theme.palette.primary.dark],
                    normalizeFunction: "polynomial"
                  }]
                }}
                onRegionTipShow={(e: any, el: any, code: string) => {
                  const count = mapData[code.toUpperCase()] || 0;
                  const countText = count === 1 ? '1 consent' : `${count} consents`;
                  el.html(`
                    <div style="
                      background: ${theme.palette.background.paper};
                      padding: 8px 12px;
                      border-radius: 4px;
                      border: 1px solid ${colors.PRIMARY}30;
                      font-family: SF Pro Display, Inter, sans-serif;
                      font-size: 12px;
                    ">
                      ${el.html()}: ${countText}
                    </div>
                  `);
                }}
                regionStyle={{
                  initial: {
                    fill: theme.palette.mode === 'dark' 
                      ? theme.palette.grey[800] 
                      : theme.palette.grey[200],
                    fillOpacity: 0.9,
                    stroke: "none",
                  },
                  hover: {
                    fillOpacity: 0.7,
                    cursor: "pointer"
                  }
                }}
              />
            </Box>
            <Typography variant="caption" sx={CHART_DESCRIPTION_STYLE}>
              Geographic distribution of consent collection across regions.
            </Typography>
          </Paper>
        </motion.div>
      </Grid>
    </Grid>
  );
}

// Add TypeScript interfaces for the data
interface MandatoryVsOptionalItem {
  name: string;
  value: number;
  color: string;
}

interface ExpiredConsentsItem {
  date: string;
  count: number;
}

interface GeolocationItem {
  location: string;
  count: number;
}

interface NoticeStatusItem {
  status: string;
  count: number;
}
