'use client';

import { Box } from '@mui/material';
import { ThemedLayoutV2, ThemedSiderV2 } from "@refinedev/mui";
import { DarkModeToggle } from '../header/dark-mode-toggle';

const CustomSider = () => {
  return (
    <ThemedSiderV2 
      render={({ items, logout }) => {
        return (
          <Box sx={{ 
            height: '100vh',
            overflow: 'auto',
            '& .MuiDrawer-root': {
              width: '200px !important', // Fixed width
              '& .MuiDrawer-paper': {
                width: '200px !important' // Fixed width for paper element
              }
            }
          }}>
            {items}
            {logout}
          </Box>
        );
      }}
    />
  );
};

export const CustomThemedLayout = ({ 
  children,
  ...rest
}: React.PropsWithChildren<{}>) => {
  return (
    <ThemedLayoutV2
      {...rest}
      Header={() => (
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          padding={1}
        >
          <DarkModeToggle />
        </Box>
      )}
      Sider={CustomSider}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          p: 2,
          '& .MuiPaper-root': {
            width: '100%',
          },
          '& .MuiBox-root': {
            width: '100%',
          },
          '& .MuiDataGrid-root': {
            width: '100%',
          },
          '& .MuiDataGrid-main': {
            width: '100%',
          },
          '& .MuiDataGrid-virtualScroller': {
            width: '100%',
          },
        }}
      >
        {children}
      </Box>
    </ThemedLayoutV2>
  );
};