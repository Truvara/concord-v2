"use client";

import React from "react";
import { Suspense } from "react";
import { useAuthenticated } from "@refinedev/core";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LockIcon from '@mui/icons-material/Lock';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import SettingsIcon from '@mui/icons-material/Settings';

export default function IndexPage() {
  const { data: auth, isLoading } = useAuthenticated();
  const router = useRouter();

  if (!isLoading && !auth?.authenticated) {
    router.push("/login");
    return null;
  }

  const modules = [
    {
      title: "Consent Management",
      icon: LockIcon,
      description: "Manage and track user consents, preferences, and privacy choices. Monitor consent collection and maintain compliance with privacy regulations."
    },
    {
      title: "Forms",
      icon: DescriptionIcon,
      description: "Create and manage consent forms, privacy notices, and data collection interfaces. Customize form fields and validation rules."
    },
    {
      title: "Purposes",
      icon: CategoryIcon,
      description: "Define and organize data processing purposes. Track purpose-specific consents and maintain transparency in data usage."
    },
    {
      title: "Preferences",
      icon: SettingsIcon,
      description: "Configure system settings, user preferences, and notification rules. Customize the platform according to your organization's needs."
    }
  ];

  return (
    <Suspense>
      <Box
        sx={{
          padding: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2
        }}
      >
        {/* Banner Section */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '345px',
            overflow: 'hidden',
            borderRadius: '8px',
            marginBottom: 3,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '35%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.85)',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 40px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
              }}
            >
              <Typography 
                variant="h2" 
                sx={{ 
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'left',
                  lineHeight: 1.2,
                  fontSize: '3rem',
                  marginBottom: '8px',
                }}
              >
                Concord
              </Typography>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: 'white',
                  fontWeight: 'normal',
                  textAlign: 'left',
                  lineHeight: 1.2,
                  fontSize: '1.8rem',
                }}
              >
                Consent Management
              </Typography>
            </Box>
          </Box>
          <Image
            src="/images/concord-banner.png"
            alt="Concord Banner"
            quality={100}
            fill
            style={{ 
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            priority
          />
        </Box>

        <Typography 
          variant="h4" 
          component="h1" 
          sx={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '2rem',
            mb: 2,
          }}
        >
          Welcome to Concord-v2
        </Typography>
        
        <Card
          sx={{
            borderRadius: '16px',
            background: 'rgba(32, 34, 37, 0.7)',
            mb: 4,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{
                fontSize: '1.25rem',
                color: '#1976d2',
                mb: 2,
              }}
            >
              Quick Overview
            </Typography>
            <Typography 
              variant="body1" 
              sx={{
                color: '#fff',
                lineHeight: 1.6,
                fontSize: '1rem',
              }}
            >
              Concord-v2 is your comprehensive consent and privacy management platform. It helps organizations manage user consents, preferences, and privacy choices while maintaining compliance with privacy regulations.
            </Typography>
          </CardContent>
        </Card>

        {/* Modules Overview */}
        <Grid container spacing={3}>
          {modules.map((module, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Box sx={{ height: '100%' }}>
                {/* Header bar */}
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(45, 47, 51, 0.9)',
                    borderRadius: '8px',
                    padding: '12px',
                    mb: 2,
                  }}
                >
                  {/* Left container for icon and title */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px', // Space between icon and title
                    }}
                  >
                    <module.icon sx={{ 
                      fontSize: '1.5rem',
                      color: '#fff',
                    }} />
                    
                    <Typography 
                      sx={{
                        color: '#1976d2',
                        fontSize: '1.1rem',
                      }}
                    >
                      {module.title}
                    </Typography>
                  </Box>
                </Box>

                {/* Description */}
                <Typography 
                  variant="body1" 
                  sx={{
                    color: '#fff',
                    lineHeight: 1.6,
                    fontSize: '0.95rem',
                    pl: 1,
                  }}
                >
                  {module.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Suspense>
  );
}
