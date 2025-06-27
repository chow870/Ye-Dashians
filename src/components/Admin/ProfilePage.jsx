import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Avatar,
  Typography,
  Box,
  Stack,
  Link as MuiLink,
  IconButton,
  Tooltip,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

function ProfilePage() {
  const user = useSelector((state) => state.auth.user);
 const BackendBaseUrl = "https://ye-dashians-backend.onrender.com"
  const [editMode, setEditMode] = useState({});
  const [fieldValues, setFieldValues] = useState({
    phoneno: user?.phoneno || '',
    officeadress: user?.officeadress || '',
    mywebsite: user?.mywebsite || '',
  });

  if (!user) return null;

  const {
    _id: organiserId,
    email,
    fullname,
  } = user;

  const handleEditClick = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field, value) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }));
  };
  const updateUserProfileField = async (field, value) => {
    try {
      const res = await fetch(`${BackendBaseUrl}/api/v1/user/${organiserId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
        credentials : "include"
      });
  
      if (!res.ok) {
        throw new Error('Failed to update user field');
      }
  
      console.log(`${field} updated successfully`);
    } catch (error) {
      console.error('Error updating user field:', error);
    }
  };
  const handleBlur = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: false }));
    updateUserProfileField(field, fieldValues[field]);
    console.log(`Updated ${field}:`, fieldValues[field]);
  };

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  const renderField = (label, fieldKey) => (
    <Box display="flex" alignItems="center" gap={1}>
      {editMode[fieldKey] ? (
        <TextField
          size="small"
          variant="standard"
          value={fieldValues[fieldKey]}
          onChange={(e) => handleChange(fieldKey, e.target.value)}
          onBlur={() => handleBlur(fieldKey)}
          onKeyDown={(e) => handleKeyDown(e, fieldKey)}
          sx={{ input: { color: '#ccc' }, flexGrow: 1 }}
          fullWidth
        />
      ) : (
        <Typography variant="body2" sx={{ flexGrow: 1, color: '#ccc' }}>
          {label}: {fieldValues[fieldKey] || '—'}
        </Typography>
      )}
      {!editMode[fieldKey] && (
        <Tooltip title={`Edit ${label}`}>
          <IconButton
            size="small"
            onClick={() => handleEditClick(fieldKey)}
            sx={{
              color: '#ba68c8',
              '&:hover': { color: '#ab47bc' },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        p: 4,
        bgcolor: '#111',
        borderRadius: 3,
        border: '1px solid #333',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        color: '#eee',
        maxWidth: 700,
        margin: '2rem auto',
      }}
    >
      <Avatar
        sx={{
          width: 120,
          height: 120,
          fontSize: 48,
          bgcolor: 'primary.main',
          mr: 4,
        }}
      >
        {fullname?.[0]?.toUpperCase() || ''}
      </Avatar>

      <Stack spacing={1} flex={1}>
        <Typography variant="h5" fontWeight={600}>
          {fullname || 'Your Name'}
        </Typography>

        <Typography variant="body2" sx={{ color: '#ccc' }}>
          Organiser ID: {organiserId}
        </Typography>

        <Typography variant="body2" sx={{ color: '#ccc' }}>
          Email: {email}
        </Typography>

        {renderField('Phone No', 'phoneno')}
        {renderField('Office Address', 'officeadress')}

        <Box display="flex" alignItems="center" gap={1}>
          {editMode.mywebsite ? (
            <TextField
              size="small"
              variant="standard"
              value={fieldValues.mywebsite}
              onChange={(e) => handleChange('mywebsite', e.target.value)}
              onBlur={() => handleBlur('mywebsite')}
              onKeyDown={(e) => handleKeyDown(e, 'mywebsite')}
              sx={{ input: { color: '#ccc' }, flexGrow: 1 }}
              fullWidth
            />
          ) : (
            <Typography variant="body2" sx={{ flexGrow: 1, color: '#ccc' }}>
              Website:{' '}
              {fieldValues.mywebsite ? (
                <MuiLink
                  href={fieldValues.mywebsite}
                  target="_blank"
                  rel="noopener"
                  sx={{ color: 'secondary.light' }}
                >
                  {fieldValues.mywebsite}
                </MuiLink>
              ) : (
                '—'
              )}
            </Typography>
          )}
          {!editMode.mywebsite && (
            <Tooltip title="Edit Website">
              <IconButton
                size="small"
                onClick={() => handleEditClick('mywebsite')}
                sx={{
                  color: '#ba68c8',
                  '&:hover': { color: '#ab47bc' },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

export default ProfilePage;
