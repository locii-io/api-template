import * as React from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import Head from 'next/head';
import AdminLayout from '../../layouts/admin';

export default function UserSetting() {
  return (
    <AdminLayout>
      <Head>
        <title>Account Settings</title>
      </Head>
      <Paper variant="outlined" sx={{ p: 5 }}>
        <Typography variant="h4" fontWeight={500} gutterBottom>
          Account setting
        </Typography>
        <Typography variant="body2" color={grey[700]}>
          Update your account
        </Typography>
        <Toolbar />
        <form>
          <Box>
            <Typography variant="subtitle1">Name</Typography>
            <TextField
              value={'John Doe'}
              id="name"
              name="name"
              variant="outlined"
              size="small"
              margin="dense"
            />
          </Box>
          <Box sx={{ my: 1 }}>
            <Typography variant="subtitle1">Email</Typography>
            <TextField
              value={'test@email.com'}
              id="email"
              name="email"
              type="email"
              variant="outlined"
              size="small"
              margin="dense"
            />
          </Box>
          <Button
            variant="contained"
            sx={{
              my: 1,
              textTransform: 'none',
              fontSize: 15,
            }}
          >
            Save Changes
          </Button>
        </form>
      </Paper>
    </AdminLayout>
  );
}
