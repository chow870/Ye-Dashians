import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Typography, Box, Stack, Link as MuiLink } from '@mui/material';

function ProfilePage() {
  const organiserId = useSelector((state) => state.auth.user.uid);
  const email = useSelector((state) => state.auth.user.email);
  const fullname = useSelector((state) => state.auth.user.fullname);
  const phoneNo = useSelector((state) => state.auth.user.phoneNo);
  const officeAddress = useSelector((state) => state.auth.user.officeAdress);
  const myWebsite = useSelector((state) => state.auth.user.website);
  console.log(fullname,officeAddress,myWebsite )

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '2rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Avatar
        sx={{
          width: 120,
          height: 120,
          marginRight: '2rem',
          backgroundColor: '#1976d2',
          fontSize: '48px',
        }}
      >
        {fullname ? fullname[0].toUpperCase() : ''}
      </Avatar>
      
      <Stack spacing={1}>
        <Typography variant="h6" color="text.primary">
          {fullname || 'Your Name'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Organiser ID: {organiserId}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Email: {email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Phone No: {phoneNo}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Office Address: {officeAddress}
        </Typography>
        {myWebsite && (
          <MuiLink href={myWebsite} target="_blank" rel="noopener" color="primary">
            {myWebsite}
          </MuiLink>
        )}
      </Stack>
    </Box>
  );
}

export default ProfilePage;
