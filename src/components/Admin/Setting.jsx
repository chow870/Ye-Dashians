import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Avatar,
  Typography,
  Box,
  Stack,
  IconButton,
  Tooltip,
  TextField,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { storage } from '../../firebase';
import { setUser } from '../../redux/slices/authSlice'; // optional – update Redux after PATCH

function SettingsPage() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  if (!user) return null;

  const { _id: organiserId, email } = user;

  const [editMode, setEditMode] = useState({});
  const [fieldValues, setFieldValues] = useState({
    fullname: user.fullname || '',
    password: '',
  });
  const [profileImage, setProfileImage] = useState(user.profileImage || '');

  // ------------------ helpers ------------------
  const handleEditClick = (field) =>
    setEditMode((prev) => ({ ...prev, [field]: true }));

  const handleFieldChange = (field, value) =>
    setFieldValues((prev) => ({ ...prev, [field]: value }));

  // 🔑 central update function
  const updateUserProfileField = async (field, value) => {
    try {
      // ---------------- image branch ----------------
      if (field === 'profileImage') {
        const uploadTask = storage
          .ref(`/users/${organiserId}/ProfileImage`)
          .put(value);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            null,
            (err) => reject(err),
            async () => {
              const url = await uploadTask.snapshot.ref.getDownloadURL();

              const res = await fetch(`/api/v1/user/${organiserId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profileImage: url }),
              });
              if (!res.ok) throw new Error('Update failed');

              setProfileImage(url);
              dispatch(setUser({ ...user, profileImage: url })); // keep Redux in sync
              resolve();
            }
          );
        });
        return;
      }

      // ---------------- text/password branch ----------------
      const res = await fetch(`/api/v1/user/${organiserId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error('Update failed');

      if (field === 'password') {
        setFieldValues((prev) => ({ ...prev, password: '' }));
      }
      if (field === 'fullname') {
        dispatch(setUser({ ...user, fullname: value }));
      }
      console.log(`${field} updated successfully`);
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
    }
  };

  const handleBlur = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: false }));
    if (fieldValues[field]) updateUserProfileField(field, fieldValues[field]);
  };

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') e.target.blur();
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) updateUserProfileField('profileImage', file);
  };

  // --------------- helpers for rendering fields ---------------
  const renderField = (label, key, isPassword = false) => (
    <Box display="flex" alignItems="center" gap={1}>
      {editMode[key] ? (
        <TextField
          size="small"
          variant="standard"
          type={isPassword ? 'password' : 'text'}
          value={fieldValues[key]}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          onBlur={() => handleBlur(key)}
          onKeyDown={(e) => handleKeyDown(e, key)}
          sx={{ input: { color: '#ccc' }, flexGrow: 1 }}
          fullWidth
        />
      ) : (
        <Typography variant="body2" sx={{ flexGrow: 1, color: '#ccc' }}>
          {label}:{' '}
          {key === 'password'
            ? '••••••••'
            : fieldValues[key] || '—'}
        </Typography>
      )}
      {!editMode[key] && (
        <Tooltip title={`Edit ${label}`}>
          <IconButton
            size="small"
            onClick={() => handleEditClick(key)}
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

  // ------------------------ UI ------------------------
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
      {/* Avatar + upload */}
      <Box textAlign="center" mr={4}>
        <Avatar
          src={profileImage}
          sx={{ width: 120, height: 120, fontSize: 48, bgcolor: 'primary.main' }}
        >
          {fieldValues.fullname?.[0]?.toUpperCase() || ''}
        </Avatar>
        <Button
          component="label"
          variant="text"
          sx={{ mt: 1, fontSize: 12, color: '#9b5de5' }}
        >
          Change Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleProfileImageChange}
          />
        </Button>
      </Box>

      {/* Details */}
      <Stack spacing={1} flex={1}>
        <Typography variant="h5" fontWeight={600}>
          {fieldValues.fullname || 'Your Name'}
        </Typography>

        <Typography variant="body2" sx={{ color: '#ccc' }}>
          Organiser ID: {organiserId}
        </Typography>
        <Typography variant="body2" sx={{ color: '#ccc' }}>
          Email: {email}
        </Typography>

        {renderField('Full Name', 'fullname')}
        {renderField('Password', 'password', true)}
      </Stack>
    </Box>
  );
}

export default SettingsPage;
