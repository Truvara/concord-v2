import { DevtoolsProvider } from "@providers/devtools";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { 
  notificationProvider, 
  RefineSnackbarProvider, 
  ThemedLayoutV2
} from "@refinedev/mui";
import {
  DashboardOutlined,
  GavelOutlined,
  DescriptionOutlined,
  AssignmentTurnedInOutlined,
  SettingsOutlined,
  NotificationsOutlined,
  SecurityOutlined,
  MenuOutlined
} from "@mui/icons-material";
import routerProvider from "@refinedev/nextjs-router";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React, { Suspense } from "react";

import { ColorModeContextProvider } from "@contexts/color-mode";
import { authProviderClient } from "@providers/auth-provider";
import { dataProvider } from "@providers/data-provider";
import { ThemeCustomizer } from "@components/theme-customizer";
import { CustomThemedLayout } from '@components/layout';

export const metadata: Metadata = {
  title: "Concord",
  description: "Consent Management System",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const themeCookie = cookieStore.get("theme");
  const defaultMode = themeCookie?.value === "dark" ? "dark" : "light";

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Suspense>
          <RefineKbarProvider>
            <ColorModeContextProvider defaultMode={defaultMode}>
              <ThemeCustomizer>
                <RefineSnackbarProvider>
                  <DevtoolsProvider>
                    <Refine
                      routerProvider={routerProvider}
                      authProvider={authProviderClient}
                      dataProvider={dataProvider}
                      notificationProvider={notificationProvider}
                      resources={[
                        {
                          name: "dashboard",
                          list: "/dashboard",
                          meta: {
                            label: "Dashboard",
                            icon: <DashboardOutlined />
                          }
                        },
                        {
                          name: "purpose",
                          list: "/purpose",
                          create: "/purpose/create",
                          edit: "/purpose/edit/:id",
                          show: "/purpose/show/:id",
                          meta: {
                            label: "Purpose",
                            icon: <GavelOutlined />
                          }
                        },
                        {
                          name: "forms",
                          list: "/forms",
                          create: "/forms/create",
                          edit: "/forms/edit/:id",
                          show: "/forms/show/:id",
                          meta: {
                            label: "Forms",
                            icon: <DescriptionOutlined />
                          }
                        },
                        {
                          name: "preferences",
                          list: "/preferences",
                          create: "/preferences/create",
                          edit: "/preferences/edit/:id",
                          show: "/preferences/show/:id",
                          meta: {
                            label: "Preferences",
                            icon: <SettingsOutlined />
                          }
                        },
                        {
                          name: "consents",
                          list: "/consents",
                          edit: "/consents/edit/:id",
                          show: "/consents/show/:id",
                          meta: {
                            label: "Consents",
                            icon: <AssignmentTurnedInOutlined />
                          }
                        },
                        {
                          name: "notice",
                          list: "/notice",
                          create: "/notice/create",
                          edit: "/notice/edit/:id",
                          show: "/notice/show/:id",
                          meta: {
                            label: "Notice",
                            icon: <NotificationsOutlined />
                          }
                        }
                      ]}
                      options={{
                        syncWithLocation: true,
                        warnWhenUnsavedChanges: true,
                        useNewQueryKeys: true,
                        projectId: "SCsVHx-E49g0l-pYErBt",
                        title: { text: "Concord", icon: "/favicon.ico" },
                        
                      }}
                    >
                      <CustomThemedLayout>
                        {children}
                      </CustomThemedLayout>
                      <RefineKbar />
                    </Refine>
                  </DevtoolsProvider>
                </RefineSnackbarProvider>
              </ThemeCustomizer>
            </ColorModeContextProvider>
          </RefineKbarProvider>
        </Suspense>
      </body>
    </html>
  );
}
