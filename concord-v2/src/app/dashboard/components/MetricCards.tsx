import { Grid, Paper, Typography, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

interface MetricCardsProps {
  data: {
    totalPurposes: number;
    totalForms: number;
    totalConsents: number;
    totalNotices: number;
  };
  isLoading: boolean;
}

export default function MetricCards({ data, isLoading }: MetricCardsProps) {
  const metrics = [
    { title: "Purposes", value: data.totalPurposes, color: "#90CAF9" },
    { title: "Forms", value: data.totalForms, color: "#CE93D8" },
    { title: "Consents", value: data.totalConsents, color: "#81C784" },
    { title: "Notices", value: data.totalNotices, color: "#FFD54F" },
  ];

  return (
    <Grid container spacing={2}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={metric.title}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: index * 0.1 }}
          >
            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: 2,
                background: `linear-gradient(135deg, ${metric.color}15, ${metric.color}05)`,
                border: `1px solid ${metric.color}30`,
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Typography 
                variant="subtitle2" 
                color="textSecondary"
                sx={{
                  fontFamily: '"SF Pro Display", "Inter", sans-serif',
                  fontSize: '0.875rem',
                  mb: 1
                }}
              >
                {metric.title}
              </Typography>
              {isLoading ? (
                <CircularProgress size={24} sx={{ alignSelf: 'center' }} />
              ) : (
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: metric.color,
                    fontFamily: '"SF Pro Display", "Inter", sans-serif',
                    fontWeight: 600
                  }}
                >
                  {metric.value.toLocaleString()}
                </Typography>
              )}
            </Paper>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
} 