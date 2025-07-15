import React from 'react';
import { Autocomplete, Chip, TextField, Box, Typography } from '@mui/material';

// Common permission options for mobile applications
const DEFAULT_PERMISSIONS = [
  // Common Android Permissions
  'android.permission.CAMERA',
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.WRITE_EXTERNAL_STORAGE',
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.ACCESS_COARSE_LOCATION',
  'android.permission.READ_CONTACTS',
  'android.permission.READ_PHONE_STATE',
  'android.permission.RECORD_AUDIO',
  'android.permission.ACCESS_NETWORK_STATE',
  'android.permission.INTERNET',
  
  // Common iOS Permissions
  'NSCameraUsageDescription',
  'NSPhotoLibraryUsageDescription',
  'NSLocationWhenInUseUsageDescription',
  'NSLocationAlwaysUsageDescription',
  'NSContactsUsageDescription',
  'NSMicrophoneUsageDescription',
  'NSCalendarsUsageDescription',
  'NSPhotoLibraryAddUsageDescription',
  'NSFaceIDUsageDescription',
  
  // Generic Permissions
  'read',
  'write',
  'delete',
  'admin',
];

interface PermissionSelectorProps {
  value: string[];
  onChange: (newValue: string[]) => void;
  disabled?: boolean;
}

export const PermissionSelector: React.FC<PermissionSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  // Group permissions by platform
  const groupedOptions = {
    'Android Permissions': DEFAULT_PERMISSIONS.filter(p => p.startsWith('android.')),
    'iOS Permissions': DEFAULT_PERMISSIONS.filter(p => p.startsWith('NS')),
    'Generic Permissions': DEFAULT_PERMISSIONS.filter(p => !p.startsWith('android.') && !p.startsWith('NS'))
  };

  return (
    <Box>
      <Autocomplete
        multiple
        options={DEFAULT_PERMISSIONS}
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        freeSolo
        disabled={disabled}
        groupBy={(option) => {
          if (option.startsWith('android.')) return 'Android Permissions';
          if (option.startsWith('NS')) return 'iOS Permissions';
          return 'Generic Permissions';
        }}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => {
            const { key, ...otherProps } = getTagProps({ index });
            return (
              <Chip
                key={key}
                label={option}
                {...otherProps}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ m: 0.5 }}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder={disabled ? "" : "Add permissions..."}
            fullWidth
          />
        )}
        renderGroup={(params) => (
          <Box key={params.key}>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ pl: 2, pt: 1, display: 'block' }}
            >
              {params.group}
            </Typography>
            {params.children}
          </Box>
        )}
        sx={{
          '& .MuiOutlinedInput-root': {
            padding: 1,
          },
          '& .MuiAutocomplete-tag': {
            margin: 0.5,
          },
        }}
      />
    </Box>
  );
};
